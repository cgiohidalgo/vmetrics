# Tratamiento de datos

# Import models
from apps.images.serializers import *
from sklearn.model_selection import KFold
from sklearn import metrics
from sklearn.naive_bayes import GaussianNB  # Import Naive Bayes Classifier
from sklearn.metrics import roc_auc_score, roc_curve
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix

# Import train_test_split function
from sklearn.model_selection import train_test_split
from sklearn import svm  # Import KNN Classifier (SVC, NuSVC and LinearSVC)
from sklearn.neighbors import KNeighborsClassifier  # Import KNN Classifier
from sklearn.tree import DecisionTreeClassifier  # Import Decision Tree Classifier
import pandas as pd
import json

# Gráficos
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import seaborn as sns
import six  # sklearn.externals.six
import sys  # sklearn.externals.six

from functions.Emails import Email
from django.conf import settings

# Entrenamiento de modelo
import joblib

sys.modules["sklearn.externals.six"] = six  # sklearn.externals.six


class MachineLearning:
    def __init__(self, path, infoSerializer, current_path, check):
        self.path = path
        self.infoSerializer = infoSerializer
        self.current_path = current_path
        self.check = check
        self.error = False
        self.emailList = []
        self.meanList = []
        self.accDT = -1
        self.accKNN = -1
        self.accNB = -1
        self.accSVM = -1
        self.rocDT = -1
        self.rocKNN = -1
        self.rocNB = -1
        self.rocSVM = -1
        self.matrixInfoDT = {}
        self.matrixInfoKNN = {}
        self.matrixInfoNB = {}
        self.matrixInfoSVM = {}
        self.studentInfo = []
        self.csvInfo()

    # DATOS
    def csvInfo(self):
        try:
            datos = pd.read_csv(self.path, sep=",")
            datos = datos.loc[
                :,
                [
                    "email",
                    "realname",
                    "grade",
                    "task_succeeded",
                    "task_tried",
                    "total_tries",
                ],
            ]
        except Exception as e:
            print(e)
            self.error = True

        if not self.error:
            self.graphCorrelacion(datos)
            datos.loc[datos["grade"] < 60, "aprueba"] = 0
            datos.loc[datos["grade"] >= 60, "aprueba"] = 1

            datos["aprueba"].unique()
            datos.isnull().sum()
            self.emails(datos)
            self.dataMean(datos)
            self.generalGraph(datos)
            vals = datos.values
            return vals.tolist()

    # EMAILS (returns object email)
    def emails(self, datos):
        advice = datos[(datos["grade"] < 60)]
        email = advice["email"]
        result = email.to_json(orient="split")
        parsed = json.loads(result)
        json.dumps(parsed, indent=4)
        self.emailList = parsed["data"]

        # Email info
        dataAdvice = advice.to_dict()
        emailData = dataAdvice["email"]
        realnameData = dataAdvice["realname"]
        gradeData = dataAdvice["grade"]
        for key in emailData.keys():
            obj = {}
            obj["email"] = emailData[key]
            obj["realname"] = realnameData[key]
            obj["grade"] = gradeData[key]
            self.studentInfo.append(obj)

    def dataMean(self, datos):
        goodData = datos[(datos["grade"] > 60)]
        lessData = datos[(datos["grade"] < 60)]
        self.meanList = [
            {
                goodData["task_succeeded"].mean(),
                goodData["task_tried"].mean(),
                goodData["total_tries"].mean(),
                lessData["task_succeeded"].mean(),
                lessData["task_tried"].mean(),
                lessData["total_tries"].mean(),
            }
        ]

    # VISUALIZACIÓN
    def generalGraph(self, datos):
        sns.countplot(x="aprueba", data=datos, palette=["#e3e3e3", "#4acccd"])
        plt.title("No aprueba VS Aprueba")

        compare = datos.value_counts(datos["aprueba"], sort=True)
        self.transformation(datos)
        vals = compare.values
        # [aprueba, no aprueba]
        # [78, 44]
        return vals.tolist()

    # # TRANSFORMACIÓN DE DATOS
    def transformation(self, datos):
        datos.drop(["email"], axis=1, inplace=True)
        vals = datos.values
        # Nombre y datos de table en front
        listInfo = vals.tolist()
        datos.drop(["realname"], axis=1, inplace=True)
        datos = datos.astype(int)
        datos.dropna(inplace=True)
        self.featuresTrain(datos)
        return listInfo

    # FEATURES Y CLASE
    def featuresTrain(self, datos):
        features = ["grade", "task_succeeded", "task_tried", "total_tries"]
        X = datos[features]  # Features
        # X = datos['Clase','Sexo','Edad']
        y = datos["aprueba"]
        kf = KFold(n_splits=4)
        kf.get_n_splits(X)
        kf1 = KFold(n_splits=2)
        kf1.get_n_splits(y)

        # DATASET DE ENTRENAMIENTO Y TESTEO
        # datos de entreno y testeo
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.4)

        if self.check:
            self.modelsTrain(X_train, X_test, y_train, y_test)
        else:
            self.modelZeroMain(X_train, X_test, y_train, y_test)
        return y_test

    # MODELOS Y ENTRENOS
    def modelsTrain(self, X_train, X_test, y_train, y_test):
        # Crear modelo DT
        modeloDT = DecisionTreeClassifier(criterion="entropy", max_depth=3)

        # Entrenamiento del modelo
        modeloDT = modeloDT.fit(X_train, y_train)

        # Predecir para el dataset de testeo
        y_predDT = modeloDT.predict(X_test)
        self.accDT = round(metrics.accuracy_score(y_test, y_predDT), 3).flatten()[0]
        joblib.dump(modeloDT, "functions/ml/modelo_DT.pkl")

        self.confMatrix(y_predDT, y_test, "DT")

        # Crear modelo KNN
        modeloKNN = KNeighborsClassifier(n_neighbors=20)

        # Entrenamiento del modelo
        modeloKNN = modeloKNN.fit(X_train, y_train)

        # Predecir para el dataset de testeo
        y_predKNN = modeloKNN.predict(X_test)
        self.accKNN = round(metrics.accuracy_score(y_test, y_predKNN), 3).flatten()[0]
        joblib.dump(modeloKNN, "functions/ml/modelo_KNN.pkl")

        self.confMatrix(y_predKNN, y_test, "KNN")

        # Crear modelo Naive Bayes
        modeloNB = GaussianNB()

        # Entrenamiento del modelo
        modeloNB = modeloNB.fit(X_train, y_train)

        # Predecir para el dataset de testeo
        y_predNB = modeloNB.predict(X_test)
        self.accNB = round(metrics.accuracy_score(y_test, y_predNB), 3).flatten()[0]
        joblib.dump(modeloNB, "functions/ml/modelo_NB.pkl")

        self.confMatrix(y_predNB, y_test, "NB")

        # Crear modelo SVM
        modeloSVM = svm.SVC()

        # Entrenamiento del modelo
        modeloSVM = modeloSVM.fit(X_train, y_train)

        # Predecir para el dataset de testeo
        y_predSVM = modeloSVM.predict(X_test)
        self.accSVM = round(metrics.accuracy_score(y_test, y_predSVM), 3).flatten()[0]
        joblib.dump(modeloSVM, "functions/ml/modelo_SVM.pkl")

        self.confMatrix(y_predSVM, y_test, "SVM")
        self.roc(y_test, y_predDT, y_predKNN, y_predNB, y_predSVM)

    # LEYENDO ARCHIVOS DE MODELO
    def modelZeroMain(self, X_train, X_test, y_train, y_test):
        # Crear modelo DT
        modeloDT = joblib.load("../functions/ml/modelo_DT.pkl")

        # Entrenamiento del modelo
        modeloDT = modeloDT.fit(X_train, y_train)

        # Predecir para el dataset de testeo
        y_predDT = modeloDT.predict(X_test)
        self.accDT = round(metrics.accuracy_score(y_test, y_predDT), 3).flatten()[0]

        self.confMatrix(y_predDT, y_test, "DT")

        # Crear modelo KNN
        modeloKNN = joblib.load("../functions/ml/modelo_KNN.pkl")

        # Entrenamiento del modelo
        modeloKNN = modeloKNN.fit(X_train, y_train)

        # Predecir para el dataset de testeo
        y_predKNN = modeloKNN.predict(X_test)
        self.accKNN = round(metrics.accuracy_score(y_test, y_predKNN), 3).flatten()[0]

        self.confMatrix(y_predKNN, y_test, "KNN")

        # Crear modelo Naive Bayes
        modeloNB = joblib.load("../functions/ml/modelo_NB.pkl")

        # Entrenamiento del modelo
        modeloNB = modeloNB.fit(X_train, y_train)

        # Predecir para el dataset de testeo
        y_predNB = modeloNB.predict(X_test)
        self.accNB = round(metrics.accuracy_score(y_test, y_predNB), 3).flatten()[0]

        self.confMatrix(y_predNB, y_test, "NB")

        # Crear modelo SVM
        modeloSVM = joblib.load("../functions/ml/modelo_SVM.pkl")

        # Entrenamiento del modelo
        modeloSVM = modeloSVM.fit(X_train, y_train)

        # Predecir para el dataset de testeo
        y_predSVM = modeloSVM.predict(X_test)
        self.accSVM = round(metrics.accuracy_score(y_test, y_predSVM), 3).flatten()[0]

        self.confMatrix(y_predSVM, y_test, "SVM")
        self.roc(y_test, y_predDT, y_predKNN, y_predNB, y_predSVM)

    # MÉTRICAS DE DIAGNÓSTICO
    # MATRIZ DE CONFUSIÓN
    def show_results(self, y_test, y_pred, url, model):
        LABELS = ["No_aprueba", "Aprueba"]
        conf_matrix = confusion_matrix(y_test, y_pred)
        plt.figure(figsize=(8, 8))
        sns.heatmap(
            conf_matrix, xticklabels=LABELS, yticklabels=LABELS, annot=True, fmt="d"
        )
        if model == "DT":
            modelo = "Decision Tree"
            self.matrixInfoDT = classification_report(
                y_test,
                y_pred,
                target_names=["No_aprueba", "Aprueba"],
                output_dict=True,
            )
        if model == "KNN":
            modelo = "K-nearest neighbors"
            self.matrixInfoKNN = classification_report(
                y_test,
                y_pred,
                target_names=["No_aprueba", "Aprueba"],
                output_dict=True,
            )
        if model == "NB":
            modelo = "Naive Bayes"
            self.matrixInfoNB = classification_report(
                y_test,
                y_pred,
                target_names=["No_aprueba", "Aprueba"],
                output_dict=True,
            )
        if model == "SVM":
            modelo = "Support vector machine"
            self.matrixInfoSVM = classification_report(
                y_test,
                y_pred,
                target_names=["No_aprueba", "Aprueba"],
                output_dict=True,
            )
        plt.title(
            label="Matriz de confusión del modelo \n" + modelo + "\n",
            fontname="arial",
            size=16,
            fontweight="bold",
        )
        plt.ylabel("True class (Realidad)")
        plt.xlabel("Predicted class (Predicción)")
        plt.savefig(url, dpi=400, transparent=True)
        # plt.show()

    # MATRIZ POR MODELO

    def confMatrix(self, y_test, y_pred, model):
        Matriz = confusion_matrix(y_test, y_pred)
        # url = "../frontend/public/assets/img/Matriz"+model
        url = "./media/imgCsv/Matriz" + model
        self.show_results(y_test, y_pred, url, model)
        return Matriz

    # Gráfico de distribución para cada variable numérica
    # ==============================================================================
    # Ajustar número de subplots en función del número de columnas
    def graphCorrelacion(self, datos):
        fig, axes = plt.subplots(nrows=2, ncols=3, figsize=(8, 8))
        axes = axes.flat
        columnas_numeric = datos.select_dtypes(include=["float64", "int"]).columns
        columnas_numeric = columnas_numeric.drop("grade")

        for i, colum in enumerate(columnas_numeric):
            sns.regplot(
                x=datos[colum],
                y=datos["grade"],
                color="#F8485E",
                marker=".",
                scatter_kws={"alpha": 0.4},
                line_kws={"color": "#00C1D4", "alpha": 0.7},
                ax=axes[i],
            )
            axes[i].set_title(f"Calificación vs {colum}", fontsize=7, fontweight="bold")
            # axes[i].ticklabel_format(style='sci', scilimits=(-4,4), axis='both')
            axes[i].yaxis.set_major_formatter(ticker.EngFormatter())
            axes[i].xaxis.set_major_formatter(ticker.EngFormatter())
            axes[i].tick_params(labelsize=6)
            axes[i].set_xlabel("")
            axes[i].set_ylabel("")

        # Se eliminan los axes vacíos
        for i in [5]:
            fig.delaxes(axes[i])

        fig.tight_layout()
        plt.subplots_adjust(top=0.9)
        fig.suptitle("Correlación con calificación", fontsize=10, fontweight="bold")
        plt.savefig("./media/imgCsv/General.png", dpi=400, transparent=True)

    # PRUEBA DIAGNÓSTICA DE TODOS LOS MODELOS
    def roc(self, y_test, y_predDT, y_predKNN, y_predNB, y_predSVM):
        roc_scoreDT = roc_auc_score(y_test, y_predDT)
        self.rocDT = roc_scoreDT

        roc_scoreKNN = roc_auc_score(y_test, y_predKNN)
        self.rocKNN = roc_scoreKNN

        roc_scoreNB = roc_auc_score(y_test, y_predNB)
        self.rocNB = roc_scoreNB

        roc_scoreSVM = roc_auc_score(y_test, y_predSVM)
        self.rocSVM = roc_scoreSVM
        plt.clf()

        fpr, tpr, threshold = roc_curve(y_test, y_predDT)
        plt.plot(
            fpr,
            tpr,
            color="Blue",
            label="Decision Tree (roc score = {0:0.2f})".format(roc_scoreDT),
        )
        fpr, tpr, threshold = roc_curve(y_test, y_predKNN)
        plt.plot(
            fpr,
            tpr,
            color="Red",
            label="k-nearest neighbors (roc score = {0:0.2f})".format(roc_scoreKNN),
        )
        fpr, tpr, threshold = roc_curve(y_test, y_predNB)
        plt.plot(
            fpr,
            tpr,
            color="Green",
            label="Naive Bayes (roc score = {0:0.2f})".format(roc_scoreNB),
        )
        fpr, tpr, threshold = roc_curve(y_test, y_predSVM)
        plt.plot(
            fpr,
            tpr,
            color="Yellow",
            label="Support vector machine (roc score = {0:0.2f})".format(roc_scoreSVM),
        )

        plt.xlabel("False Positive Rate (FPR)")
        plt.ylabel("Tru e Positive Rate (TPR)")
        plt.title("ROC Curve of classification models")
        plt.legend(loc="lower right")
        # plt.savefig("../frontend/public/assets/img/roc",
        #             dpi=400, transparent=True)  # exportar imagen
        plt.savefig("./media/imgCsv/roc", dpi=400, transparent=True)
        try:
            newData = {
                "csvFile_id": self.infoSerializer,
                "image1": "media/imgCsv/General.png",
                "image2": "media/imgCsv/MatrizDT.png",
                "image3": "media/imgCsv/MatrizKNN.png",
                "image4": "media/imgCsv/MatrizNB.png",
                "image5": "media/imgCsv/MatrizSVM.png",
                "image6": "media/imgCsv/roc.png",
            }
            serializerImage = ImageSerializer(data=newData)
            if serializerImage.is_valid():
                serializerImage.save()
            else:
                print(serializerImage.errors)
        except Exception as e:
            print(e)
            pass
