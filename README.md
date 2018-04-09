[![Build Status](https://travis-ci.org/OpenOlitor/openolitor-client-admin.svg?branch=master)](https://travis-ci.org/OpenOlitor/openolitor-client-admin)
[![Code Climate](https://codeclimate.com/github/OpenOlitor/openolitor-client-admin/badges/gpa.svg)](https://codeclimate.com/github/OpenOlitor/openolitor-client-admin)

# openolitor-client-admin
Frontend der OpenOlitor Administrationsplattform

## Entwicklungs-Setup
https://github.com/OpenOlitor/OpenOlitor/wiki/Doku-Technisch_Client_Ent-Setup

## Dokumentation
Die gesamte Dokumentation befindet sich auf dem OpenOlitor-Projekt-Wiki
https://github.com/OpenOlitor/OpenOlitor/wiki/

## Lizenz / License
Code bis April 2018 wurde unter [GPL v3](LICENSE_legacy) publiziert. Ab April 2018 wird OpenOlitor unter [AGPL v3](LICENSE) veröffentlicht.

## bumpversion.sh
Mittels `./bumpversion.sh` (`./bumpversion.sh -v 1.0.x`) wird die Version im `pacakge.json` und `bower.json` dieses Projekts erhöht.
Mit dem Flag -c/--commit wird ein git commit und ein git tag mit entsprechender Nachricht gemacht.
Anderseits werden die nötigen git Befehle ausgegeben.

