package main

import (
	"fmt"

	settings "github.com/DegustatorPonos/ThreeWordsTwitchChatGame/Settings"
)

func main() {
	if settingsErr := settings.ReadSettings(); settingsErr != nil {
		panic(fmt.Sprintf("Failed to read settings file: %s", settingsErr.Error()))
	}
	fmt.Println(settings.Current)
}
