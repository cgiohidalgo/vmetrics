# tools
from read import read

# apps
from apps.students.models import Student
from apps.tasks.models import Task
from apps.resources.models import Resource
from apps.inputs.models import Input

# serializers
from apps.students.serializers import StudentSerializer, StudentTaskSerializer
from apps.tasks.serializers import TaskSerializer
from apps.inputs.serializers import InputsSerializer


class UploadSubmission:
    def __init__(self, data=None, path=None):
        if path:
            self.path = path
            self.data = read(path)
        else:
            self.data = data

        self.task = 0
        self.taskid = ""
        self.student = 0
        self._id = ""
        self.courseid = ""
        self.grade = 0.0
        self.result = ""
        self.submitted_on = ""
        self.source_code = ""

    def save_data(self, data_list=None):
        uploaded = 0
        errors = []
        info = self.data
        tasks_id_list = {}  # distinc taskid
        course_id_list = []  # distinc courseid
        if data_list:
            info = data_list

        # find all coursesid in file
        for obj in info:
            if obj["courseid"] not in course_id_list:
                course_id_list.append(obj["courseid"])

        if len(course_id_list) > 1:
            return {
                "status": False,
                "data": f"Solo se pueden cargar actividades pertenecientes a un único curso.",
            }

        # catch course if is not created
        try:
            Resource.objects.get(resource_name=course_id_list[0], is_active=True)
        except Resource.DoesNotExist:
            return {
                "status": False,
                "data": f"No existe un curso llamado: '{course_id_list[0]}'. En la sección de cursos puedes crearlo.",
            }

        self.courseid = course_id_list[0]  # courseid for all request

        # find all tasksid in file
        for obj in info:
            if obj["taskid"] not in tasks_id_list:
                tasks_id_list[obj["taskid"]] = None

        # create taskid if not exists
        t = None
        for key in tasks_id_list:
            try:
                t = Task.objects.get(taskid=key).pk
            except Task.DoesNotExist:

                task_data = {}
                resource = Resource.objects.get(resource_name=self.courseid)
                task_data["taskid"] = key
                task_data["resource"] = resource.id
                task_data["description"] = "Task loaded by uploading file"
                task_data["name"] = "No name"
                task_serializer = TaskSerializer(data=task_data)
                if task_serializer.is_valid():
                    task_serializer.save()
                    t = task_serializer.data["pk"]
                else:
                    print(task_serializer.errors)
                    return {
                        "status": False,
                        "data:": "Ha ocurrido un error al crear la actividad.",
                    }
            finally:
                tasks_id_list[key] = t

        # start to insert students inputs
        for data in info:
            if data["_id"]:
                if Input.objects.filter(_id=data["_id"]).exists():
                    continue
                self._id = data["_id"]

            if data["taskid"]:
                self.taskid = data["taskid"]

            if data["grade"]:
                self.grade = float(data["grade"])

            if data["result"]:
                self.result = data["result"]

            if data["submitted_on"]:
                self.submitted_on = data["submitted_on"]

            if data["input"] != None:
                self.source_code = data["input"]

            if data["username"]:
                try:
                    Student.objects.get(username=data["username"])
                except Student.DoesNotExist:
                    student_data = {}
                    student_data["username"] = data["username"]
                    student_serializer = StudentSerializer(data=student_data)
                    if student_serializer.is_valid():
                        student_serializer.save()
                    else:
                        print(student_serializer.errors)
                        return {
                            "status": False,
                            "data": "Ha ocurrido un error con el cargue de la información(Estudiantes).",
                        }
                finally:
                    user = Student.objects.get(username=data["username"])
                    self.student = user

            input_data = {
                "student": self.student.pk,
                "task": tasks_id_list[data["taskid"]],
                "_id": self._id,
                "taskid": self.taskid,
                "courseid": self.courseid,
                "grade": self.grade,
                "result": self.result,
                "submitted_on": self.submitted_on,
                "source_code": self.source_code,
            }
            student_task_data = {
                "student": self.student.pk,
                "task": tasks_id_list[self.taskid],
            }
            student_task_serializer = StudentTaskSerializer(data=student_task_data)
            input_serializer = InputsSerializer(data=input_data)

            if input_serializer.is_valid() & student_task_serializer.is_valid():
                try:
                    input_serializer.save()
                    student_task_serializer.save()
                    uploaded += 1

                except Exception as e:
                    error_message = "Error: character type"
                    input_data["source_code"] = error_message
                    input_serializer = InputsSerializer(data=input_data)
                    if input_serializer.is_valid() & student_task_serializer.is_valid():
                        input_serializer.save()
                        student_task_serializer.save()
                        uploaded += 1
                    errors.append(input_data)
                    continue

            else:
                # print("INPUT_DATA: ", end=" ")
                # print(input_data)
                errors.append(input_data)
                continue

        # for err in errors:
        #     print("ERRORS: ", end=" ")
        #     print(err)

        return {
            "status": True,
            "resource": self.courseid,
            "uploaded": uploaded,
            "errors": errors,
        }
