import subprocess
import json

# from read import read
import tempfile


class ExtractMetrics:
    def __init__(self, extension, input_id):
        self.extension = extension
        self.input = input_id
        self.comment_ratio = -1
        self.cyclomatic_complexity = -1
        self.fanout_external = -1
        self.fanout_internal = -1
        self.halstead_bugprop = -1
        self.halstead_difficulty = -1
        self.halstead_effort = -1
        self.halstead_timerequired = -1
        self.halstead_volume = -1
        self.loc = -1
        self.maintainability_index = -1
        self.operands_sum = -1
        self.operands_uniq = -1
        self.operators_sum = -1
        self.operators_uniq = -1
        self.pylint = -1
        self.tiobe = -1
        self.tiobe_compiler = -1
        self.tiobe_complexity = -1
        self.tiobe_coverage = -1
        self.tiobe_duplication = -1
        self.tiobe_fanout = -1
        self.tiobe_functional = -1
        self.tiobe_security = -1
        self.tiobe_standard = -1

    def get_metrics(self, code):
        # create temporal foler
        temp = tempfile.TemporaryDirectory()
        file_name = temp.name + "/file." + str(self.extension)
        file = open(file_name, "w")
        file.write(code)
        file.close()

        try:
            metrics = subprocess.run(["multimetric", file_name], capture_output=True)
        except Exception as e:
            print(e)
            return {"status": False, "data": e}
        to_json = json.loads(metrics.stdout.decode("utf-8"))
        metrics_json = to_json["overall"]
        self.comment_ratio = metrics_json["comment_ratio"]
        self.cyclomatic_complexity = metrics_json["cyclomatic_complexity"]
        self.fanout_external = metrics_json["fanout_external"]
        self.fanout_internal = metrics_json["fanout_internal"]
        self.halstead_bugprop = metrics_json["halstead_bugprop"]
        self.halstead_difficulty = metrics_json["halstead_difficulty"]
        self.halstead_effort = metrics_json["halstead_effort"]
        self.halstead_timerequired = metrics_json["halstead_timerequired"]
        self.halstead_volume = metrics_json["halstead_volume"]
        self.loc = metrics_json["loc"]
        self.maintainability_index = metrics_json["maintainability_index"]
        self.operands_sum = metrics_json["operands_sum"]
        self.operands_uniq = metrics_json["operands_uniq"]
        self.operators_sum = metrics_json["operators_sum"]
        self.operators_uniq = metrics_json["operators_uniq"]
        self.pylint = metrics_json["pylint"]
        self.tiobe = metrics_json["tiobe"]
        self.tiobe_compiler = metrics_json["tiobe_compiler"]
        self.tiobe_complexity = metrics_json["tiobe_complexity"]
        self.tiobe_coverage = metrics_json["tiobe_coverage"]
        self.tiobe_duplication = metrics_json["tiobe_duplication"]
        self.tiobe_fanout = metrics_json["tiobe_fanout"]
        self.tiobe_functional = metrics_json["tiobe_functional"]
        self.tiobe_security = metrics_json["tiobe_security"]
        self.tiobe_standard = metrics_json["tiobe_standard"]
        temp.cleanup()
        return {"status": True, "data": self.__dict__}
