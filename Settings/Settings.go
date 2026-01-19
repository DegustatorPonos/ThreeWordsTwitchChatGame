package settings

import (
	"encoding/json"
	"fmt"
	"os"
)

var ConfigLocation string = "Settings.json"

type Settings struct {
	DotEnvLocation string `json:"dotenvlocation"`
	WordsLocation string `json:"wordslocation"`
	Port int `json:"port"`
}

var Current Settings

func ReadSettings() error {
	var file, fileErr = os.ReadFile(ConfigLocation)
	if fileErr != nil {
		return fileErr
	}
	var data = Settings{}
	var jsonErr = json.Unmarshal(file, &data)
	if jsonErr != nil {
		return jsonErr
	}
	return nil
}

func (base Settings) String() string {
	var outp, jsonErr = json.Marshal(base)
	if jsonErr != nil {
		return fmt.Sprintf("Faild to marshal a structure: %s", jsonErr.Error())
	}
	return string(outp)
}
