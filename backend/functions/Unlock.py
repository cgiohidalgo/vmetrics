# tools
import tarfile
import os
import re
import json
from read import read


class Unlock:
    def __init__(self, path="../media/media", file="submissions.tgz"):
        self.path = path
        self.file = file
        self.extract()

    def extract(self):
        tar = tarfile.open(
            self.file,
        )
        tar.extractall(self.path)
        tar.close()

    def read_paths(self):
        """find files path with .test extension"""
        files = []
        # r=root, d=directories, f = files
        for r, d, f in os.walk(self.path):
            for file in f:
                if ".test" in file:
                    filePath = os.path.join(r, file)
                    files.append(filePath)
        return files

    def read_inputs(self, dir_list):
        """read and save info from .test files into list"""
        inputs = []
        for path in dir_list:
            inputs.append(read(path))
        return inputs

    def extract_info(self, files):
        """extract info like: _id, courseid, graderesult,
        submitted_on, taskid, username and source code from
        .test files located in local folder"""
        info = []
        errors = []
        # cont = 1
        for file in files:
            student = []

            try:
                # find _id
                data = re.search("_id:.*", file)
                data = data.group().split(": ")
                student.append(data)

                # find course id
                data = re.search("courseid: .*", file)
                data = data.group().split(": ")
                student.append(data)

                # find grade
                data = re.search("grade: .*", file)
                data = data.group().split(": ")
                student.append(data)

                # find result
                data = re.search("^result: .*", file, re.MULTILINE)
                data = data.group().split(": ")
                student.append(data)

                # find date
                data = re.search("submitted_on: .*:[0-9]{2}", file)
                data = data.group().split(": ")
                student.append(data)

                # find task id
                data = re.search("^taskid: .*", file, re.MULTILINE)
                data = data.group().split(": ")
                student.append(data)

                # find username
                data = re.search("username:.*\n-.*", file)
                data = data.group().split(":\n- ")
                student.append(data)

                # find source code
                data = extract_code(file)
                # cont += 1
                student.append(data)

                info.append(student)
            except Exception as e:
                print(student)
                errors.append(student)
                continue

        print("Errors: " + str(len(errors)))
        return info

    def write_json(self, data, name, path="/media/files/"):
        try:
            # self.cont = 1
            file = []
            for i in range(len(data)):
                try:
                    file.append(dict(data[i]))
                except:
                    print("WRITE_JSON EXCEPT: " + str(data[i]))
            file_path = f"{path}/{name}.json"
            with open(file_path, "w", encoding="utf-8") as F:
                # Using json dumps method to write the list in the disk
                F.write(json.dumps(file, ensure_ascii=False, indent=4))
            return file  # , file_path
        except Exception as e:
            print(f"Something went wrong: {e}")


# ---------------internal function--------------#


def extract_code(file):
    """extract source code from .test files"""
    try:
        data = re.search("input:(.*\n)*problems: \{\}", file)
        data = data.group().split(":\n    '")
        test = re.search(": \|.?.?.?\n(.*\n)*.*/input:", data[1])
        test = test.group()
        data[1] = test[4:-18]
    except Exception as e:
        data[0] = "input"
        data[1] = f"Error: {type(e).__name__}"
        return data
    return data
