let objMl = {
  No_aprueba: {
    precision: 1,
    recall: 1,
    "f1-score": 1,
    support: 15,
  },
  Aprueba: {
    precision: 1,
    recall: 1,
    "f1-score": 1,
    support: 34,
  },
  accuracy: 1,
  "macro avg": {
    precision: 1,
    recall: 1,
    "f1-score": 1,
    support: 49,
  },
  "weighted avg": {
    precision: 1,
    recall: 1,
    "f1-score": 1,
    support: 49,
  },
};

const data = (objMl) => {
  // for (let x in objMl) {
  //   // console.log(objMl[x].support);
  //   for (let y in x) {
  //     console.log(x[y]);
  //   }
  // }
  Object.entries(objMl).forEach(([key, value]) => {});
};

data(objMl);
// objMl.map((key, value) => {});
