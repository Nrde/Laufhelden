/*
 * Copyright (C) 2017 Jens Drescher, Germany
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

.pragma library

//gives back random int. min is inclusive and max is exclusive.
function fncGetRandomInt(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function fncPadZeros(number, size)
{
  number = number.toString();
  while (number.length < size) number = "0" + number;
  return number;
}


var arrayDataPoints =
[
    //{ heartrate: 140, elevation: 354.34, distance: 232 }
]


function fncAddDataPoint(heartrate,elevation,distance)
{
    var iPosition = arrayDataPoints.length;

    arrayDataPoints[iPosition] = new Object();
    arrayDataPoints[iPosition]["heartrate"] = heartrate;
    arrayDataPoints[iPosition]["elevation"] = elevation;
    arrayDataPoints[iPosition]["distance"] = distance;
}

function fncConvertDistanceToImperial(iKilometers)
{
    return iKilometers * 0.621371192237;
}

function fncConvertelevationToImperial(iMeters)
{
    return iMeters * 3.28084;
}

function fncConvertPacetoImperial(iPace)
{
    return iPace * 1.609344;
}

function fncConvertSpeedToImperial(iSpeed)
{
    return iSpeed * 0.621371192237;
}


//*************** Pebble functions *****************

var arrayPebbleValueTypes =
[
    { index: 0, fieldID: 0, fieldIDCoverPage: 0, value:  "", header: qsTr("Empty"), unit: "", imperialUnit: "" },
    { index: 1, fieldID: 0, fieldIDCoverPage: 0, value: "0", header: qsTr("Heartrate"), unit: "bpm", imperialUnit: "bpm" },
    { index: 2, fieldID: 0, fieldIDCoverPage: 0, value: "0", header: qsTr("Heartrate") + "∅", unit: "bpm", imperialUnit: "bpm" },
    { index: 3, fieldID: 3, fieldIDCoverPage: 3, value: "0", header: qsTr("Pace"), unit: "min/km", imperialUnit: "min/mi" },
    { index: 4, fieldID: 0, fieldIDCoverPage: 0, value: "0", header: qsTr("Pace") + "∅", unit: "min/km", imperialUnit: "min/mi" },
    { index: 5, fieldID: 0, fieldIDCoverPage: 0, value: "0", header: qsTr("Speed"), unit: "km/h", imperialUnit: "mi/h" },
    { index: 6, fieldID: 0, fieldIDCoverPage: 0, value: "0", header: qsTr("Speed") + "∅", unit: "km/h", imperialUnit: "mi/h" },
    { index: 7, fieldID: 0, fieldIDCoverPage: 0, value: "0", header: qsTr("Altitude"), unit: "m", imperialUnit: "ft" },
    { index: 8, fieldID: 2, fieldIDCoverPage: 2, value: "0", header: qsTr("Distance"), unit: "km", imperialUnit: "mi" },
    { index: 9, fieldID: 0, fieldIDCoverPage: 0, value: "0", valueCoverPage: "0", header: qsTr("Pause"), unit: "", imperialUnit: "" },
    { index: 10, fieldID: 1, fieldIDCoverPage: 1, value: "0", valueCoverPage: "0", header: qsTr("Duration"), unit: "", imperialUnit: "" }
]

//Create lookup table for pebble value fields.
//This is a helper table to easier access the main table.
var arrayLookupPebbleValueTypesByFieldID = {};
fncGenerateHelperArray();

function fncGenerateHelperArray()
{
    for (var i = 0; i < arrayPebbleValueTypes.length; i++)
    {
        arrayLookupPebbleValueTypesByFieldID[arrayPebbleValueTypes[i].fieldID] = arrayPebbleValueTypes[i];
    }
}


function fncConvertSaveStringToArray(sSaveString)
{
    //"10,8,3"

    if (sSaveString === undefined || sSaveString === "")
        return;

    var arValueTypes = sSaveString.split(",");

    if (arValueTypes.length !== 3)    //This is the amount pebble fields
        return;

    arValueTypes[0] = parseInt(arValueTypes[0]);
    arValueTypes[1] = parseInt(arValueTypes[1]);
    arValueTypes[2] = parseInt(arValueTypes[2]);

    //Go through value types
    for (var i = 0; i < arrayPebbleValueTypes.length; i++)
    {
        if (i === arValueTypes[0])
            arrayPebbleValueTypes[i].fieldID = 1;
        else if (i === arValueTypes[1])
            arrayPebbleValueTypes[i].fieldID = 2;
        else if (i === arValueTypes[2])
            arrayPebbleValueTypes[i].fieldID = 3;
        else
            arrayPebbleValueTypes[i].fieldID = 0;
    }

    fncGenerateHelperArray();
}

function fncConvertArrayToSaveString()
{
    //"10,8,3"

    var sSaveString = "";

    sSaveString = arrayLookupPebbleValueTypesByFieldID[1].index.toString();
    sSaveString = sSaveString + arrayLookupPebbleValueTypesByFieldID[2].index.toString();
    sSaveString = sSaveString + arrayLookupPebbleValueTypesByFieldID[3].index.toString();

    return sSaveString;
}

//*************** CoverPage functions *****************

//Create lookup table for cover page value fields.
//This is a helper table to easier access the main table.
var arrayLookupCoverPageValueTypesByFieldID = {};
fncGenerateHelperArrayCoverPage();

function fncGenerateHelperArrayCoverPage()
{
    for (var i = 0; i < arrayPebbleValueTypes.length; i++)
    {
        arrayLookupCoverPageValueTypesByFieldID[arrayPebbleValueTypes[i].fieldIDCoverPage] = arrayPebbleValueTypes[i];
    }
}

function fncConvertSaveStringToArrayCoverPage(sSaveString)
{
    //"10,8,3"

    if (sSaveString === undefined || sSaveString === "")
        return;

    var arValueTypes = sSaveString.split(",");

    if (arValueTypes.length !== 3)    //This is the amount pebble fields
        return;

    arValueTypes[0] = parseInt(arValueTypes[0]);
    arValueTypes[1] = parseInt(arValueTypes[1]);
    arValueTypes[2] = parseInt(arValueTypes[2]);

    //Go through value types
    for (var i = 0; i < arrayPebbleValueTypes.length; i++)
    {
        if (i === arValueTypes[0])
            arrayPebbleValueTypes[i].fieldIDCoverPage = 1;
        else if (i === arValueTypes[1])
            arrayPebbleValueTypes[i].fieldIDCoverPage = 2;
        else if (i === arValueTypes[2])
            arrayPebbleValueTypes[i].fieldIDCoverPage = 3;
        else
            arrayPebbleValueTypes[i].fieldIDCoverPage = 0;
    }

    fncGenerateHelperArrayCoverPage();
}

function fncConvertArrayToSaveStringCoverPage()
{
    //"10,8,3"

    var sSaveString = "";

    sSaveString = arrayLookupCoverPageValueTypesByFieldID[1].index.toString();
    sSaveString = sSaveString + arrayLookupCoverPageValueTypesByFieldID[2].index.toString();
    sSaveString = sSaveString + arrayLookupCoverPageValueTypesByFieldID[3].index.toString();

    return sSaveString;
}

function stravaGet(xmlhttp, url, token, onready)
{
    console.log("Loading from ", url);

    xmlhttp.open("GET", url);
    xmlhttp.setRequestHeader('Accept-Encoding', 'text');
    xmlhttp.setRequestHeader('Connection', 'keep-alive');
    xmlhttp.setRequestHeader('Pragma', 'no-cache');
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.setRequestHeader('Accept', 'application/json, text/plain, */*');
    xmlhttp.setRequestHeader('Cache-Control', 'no-cache');
    xmlhttp.setRequestHeader('Authorization', "Bearer " + token);

    xmlhttp.onreadystatechange=onready;

    xmlhttp.send();
}

//*************** Voice output functions *****************

var arrayVoiceValueTypes =
[
    { index: 0, fieldID: 3, fieldIDCoverPage: 0, value: "0", header: qsTr("Heartrate"), unit: "bpm", imperialUnit: "bpm" },
    { index: 1, fieldID: 0, fieldIDCoverPage: 0, value: "0", header: qsTr("Heartrate") + "∅", unit: "bpm", imperialUnit: "bpm" },
    { index: 2, fieldID: 2, fieldIDCoverPage: 3, value: "0", header: qsTr("Pace"), unit: "min/km", imperialUnit: "min/mi" },
    { index: 3, fieldID: 0, fieldIDCoverPage: 0, value: "0", header: qsTr("Pace") + "∅", unit: "min/km", imperialUnit: "min/mi" },
    { index: 4, fieldID: 0, fieldIDCoverPage: 0, value: "0", header: qsTr("Speed"), unit: "km/h", imperialUnit: "mi/h" },
    { index: 5, fieldID: 0, fieldIDCoverPage: 0, value: "0", header: qsTr("Speed") + "∅", unit: "km/h", imperialUnit: "mi/h" },
    { index: 6, fieldID: 0, fieldIDCoverPage: 0, value: "0", header: qsTr("Altitude"), unit: "m", imperialUnit: "ft" },
    { index: 7, fieldID: 1, fieldIDCoverPage: 2, value: "0", header: qsTr("Distance"), unit: "km", imperialUnit: "mi" }
]

function fncGenerateSoundArray(number, sUnit, iVoiceLanguage)
{
    var arraySoundArray = [];
    var sNumberToPlay = "";
    var sVoiceLanguage = "_en_male.wav";

    //check voice language and generate last part of audio filename
    if (iVoiceLanguage === 0)        //english male
        sVoiceLanguage = "_en_male.wav";
    else if (iVoiceLanguage === 1)   //german male
        sVoiceLanguage = "_de_male.wav";   

    if (isInteger(number))		//Check if it's an integer
    {
        //Check limits
        if (number > 999 || number < 0)
            return;

        if (number >= 100)
        {
            var sHundreds = parseInt(number.toString().substr(0,1) + "00");

            //Cut off hundreds
            number = parseInt(number.toString().substr(1));

            arraySoundArray.push(sHundreds.toString() + sVoiceLanguage);
        }

        arraySoundArray.push(number.toString() + sVoiceLanguage);
    }
    else if (isFloat(number))		//Check if it's a float
    {
        var sFloatArray = number.toString().split(".");

        if (typeof sFloatArray === 'undefined' || sFloatArray.length !== 2)
            sFloatArray = number.toString.split(",");

        if (typeof sFloatArray === 'undefined' || sFloatArray.length !== 2)
            return;

        //push first place. First check for size over hundred.
        if (parseInt(sFloatArray[0]) >= 100)
        {
            var sHundreds = parseInt(sFloatArray[0].substr(0,1) + "00");

            //Cut off hundreds
            sFloatArray[0] = parseInt(sFloatArray[0].substr(1));

            arraySoundArray.push(sHundreds.toString() + sVoiceLanguage);
        }
        arraySoundArray.push(sFloatArray[0] + sVoiceLanguage);

        //we only use one decimal point, check that.
        if (sFloatArray[1].length > 1)
            sFloatArray[1] = sFloatArray[1].substr(0,1);

        //push decimal place
        arraySoundArray.push("point" + sFloatArray[1] + sVoiceLanguage);
    }
    else		//if number is not int and not float, return
        return;

    //add the unit
    if (sUnit !== "")
    {
        arraySoundArray.push(sUnit + sVoiceLanguage);
    }

    return arraySoundArray;
}

function isFloat(n)
{
    return n === +n && n !== (n|0);
}

function isInteger(n)
{
    return n === +n && n === (n|0);
}
