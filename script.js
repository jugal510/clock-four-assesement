var surveyData =
    {
        "title": "This is C4 Survey",
        "pages": [
            {
                "name": "question1",
                "elements": [
                    {
                        "name": "FrameworkQuestion",
                        "title": "Do you have experience with a front-end framework like Bootstrap?",
                        "choices": [
                            "Yes",
                            "No"
                        ]
                    },
                    {
                        "name": "jsquestion",
                        "visibleIf": "{FrameworkQuestion} = 'Yes'",
                        "title": "What JS framework do you use?",
                        "choices": [
                            "React",
                            "Angular"
                        ]
                    },
                    {
                        "name": "cssquestion",
                        "visibleIf": "{FrameworkQuestion} = 'No'",
                        "title": "Do you write a lot of custom CSS?",
                        "choices": [
                            "yes",
                            "No"
                        ]
                    }
                ]
            },
            {
                "name": "Question2",
                "elements": [
                    {
                        "name": "football",
                        "title": "Do you play Football",
                        "choices": [
                            "Yes",
                            "No"
                        ]
                    },
                    {
                        "name": "gaints",
                        "visibleIf": "{football} = 'Yes'",
                        "title": "Are you Gaints Fan?",
                        "choices": [
                            "yes",
                            "No"
                        ]
                    },
                    {
                        "name": "soccer",
                        "visibleIf": "{football} = 'No'",
                        "title": "Do you like soccer",
                        "choices": [
                            "Yes",
                            "No"
                        ]
                    },
                    {
                        "name": "player",
                        "visibleIf": "{soccer} = 'yes'",
                        "title": "who is your favourite player?",
                        "choices": [
                            "Cristiano Ronaldo",
                            "Lionel Messi"
                        ]
                    },
                    {
                        "name": "game",
                        "visibleIf": "{soccer} = 'No'",
                        "title": "do you want to learn soccer?",
                        "choices": [
                            "Yes",
                            "No"
                        ]
                    }
                ]
            },
            {
                "name": "Question3",
                "elements": [
                    {
                        "name": "coffee",
                        "title": "do you like coffee?",
                        "choices": [
                            "Yes",
                            "No"
                        ]
                    }
                ]
            }
        ]
    };



console.log('surevey data---', surveyData);
//var selectedSurveyDetails = [];
window.onload = function () {
    document.getElementById('title').innerHTML = surveyData.title;

    var firstQuestions = "";
    surveyData.pages.forEach((page, questionIndex) => {
        let parentDiv = document.createElement('div');
        parentDiv.setAttribute('id', `question-element-${questionIndex}`);
        document.getElementById('survey-questions').appendChild(parentDiv);

        page.elements.forEach((questions, index) => {
            if (index == 0) {
                document.getElementById(`question-element-${questionIndex}`).appendChild(getBindQuestion(questions, questionIndex))
            }
        })
    });

}

function primaryQuestionChange(event) {
    const selectedValue = event.target.value;
    const questionName = event.target.name;
    const currentItemIndex = event.target.getAttribute('item-index');
    //console.log('eleme------', event.target.parentNode.parentNode);
    const relevantQuestion = getRelevantQuestion(selectedValue, questionName);
    const primaryQuestionContainer = event.target.parentNode.parentNode;
    const primaryItemChilds = primaryQuestionContainer.childNodes;
    console.log('node name----', primaryItemChilds[primaryItemChilds.length - 1].nodeName);
    if (relevantQuestion) {
        if (primaryItemChilds[primaryItemChilds.length - 1].nodeName == 'DIV') {
            primaryQuestionContainer.removeChild(primaryItemChilds[primaryItemChilds.length - 1])
        }
        //console.log('siblins-----', event.target.parentNode.parentNode.childNodes)
        // document.getElementById(`question-element-${currentItemIndex}`).appendChild(getBindQuestion(relevantQuestion, currentItemIndex))
        event.target.parentNode.parentNode.appendChild(getBindQuestion(relevantQuestion, currentItemIndex));
    } else if (primaryItemChilds[primaryItemChilds.length - 1].nodeName == 'DIV') {

        primaryQuestionContainer.removeChild(primaryItemChilds[primaryItemChilds.length - 1])
    }
}

function getBindQuestion(question, questionIndex) {
    let divElem = document.createElement('div');
    // divElem.setAttribute('id', `child-id-${questionIndex}`);
    //divElem.setAttribute('id', `child-elem`);
    divElem.setAttribute('class', `child-elements`);

    divElem.innerHTML = `
    <div>${question.title}</div>
    <div><input type="radio" id="${question.name + questionIndex}" item-index="${questionIndex}" onchange="primaryQuestionChange(event)" value="Yes" name="${question.name}">
    <label for="${question.name + questionIndex}" >${question.choices[0]}</label> </div>
   <div><input type="radio" id="${question.name + questionIndex + 1}" item-index="${questionIndex}" onchange="primaryQuestionChange(event)" value="No" name="${question.name}">
   <label for="${question.name + questionIndex + 1}">${question.choices[1]}</label></div>
   `;
    console.log('divElem---', divElem)
    return divElem;
}

function getRelevantQuestion(selectedValue, questionName) {
    let relevantQuestion;
    surveyData.pages.forEach((page) => {
        if (!relevantQuestion) {
            relevantQuestion = page.elements.find((element) => {
                if (element.visibleIf) {
                    return element.visibleIf.indexOf(selectedValue) > -1 && element.visibleIf.indexOf(questionName) > -1;
                }
            });
        }
    });
    return relevantQuestion;
}

function submit() {
    let isValid = true;
    surveyData.pages.forEach((page) => {
        page.elements.forEach((element) => {
            if (!checkForRadioButtonValidation(element.name)) {
                isValid = false;
            }
        })
    });

    document.getElementById('error').style.display = !isValid ? 'block' : 'none';
    if (isValid) {
        //selectedSurveyDetails = []
        surveyData.pages.forEach((page) => {
            // page.elements.forEach((element) => {
            //     const radioBtns = document.querySelectorAll('[name="' + element.name + '"]');
            //     if (radioBtns.length) {
            //         selectedSurveyDetails.push({
            //             description: element.title,
            //             selectedValue: getSelectedRadioValue(radioBtns)
            //         });
            //     }
            // })
            page.elements.map((element) => {
                const radioBtns = document.querySelectorAll('[name="' + element.name + '"]');
                if (radioBtns.length) {
                    // selectedSurveyDetails.push({
                    //     description: element.title,
                    //     selectedValue: getSelectedRadioValue(radioBtns)
                    // });
                    element.selectedValue = getSelectedRadioValue(radioBtns);
                    return element;
                }
            })
        });
        document.getElementById('survey-questions').style.display = 'none';
        document.getElementById('submitButton').style.display = 'none';
        bindselectedSurveyDetails();
    }
}


function bindselectedSurveyDetails() {

    surveyData.pages.forEach((page) => {
        let selectedValues = '';
        let currentDivElem = document.createElement('div');
        page.elements.forEach((item) => {
            if (item.selectedValue) {
                selectedValues += `<p> <span>${item.title}</span>  <span>${item.selectedValue}</span> </p>`
            }
        });
        currentDivElem.innerHTML = selectedValues;
        document.getElementById('selected-survey-details').appendChild(currentDivElem);
    });
    console.log('selectedSurveyDetails====',surveyData);
    // let selectedValues = '';
    // selectedSurveyDetails.forEach((item) =>{
    //     selectedValues += `<p> <span>${item.description}</span>  <span>${item.selectedValue}</span> </p>`
    // });
    // document.getElementById('selected-survey-details').innerHTML = selectedValues;
}


function checkForRadioButtonValidation(radioBtnName) {
    const radioBtns = document.querySelectorAll('[name="' + radioBtnName + '"]');
    let isValid = false;
    if (!radioBtns.length) {
        isValid = true;
    } else {
        for (let i = 0; i < radioBtns.length; i++) {
            if (radioBtns[i].checked) {
                isValid = true;
            }
        }
    }
    console.log('isValid-----', isValid);
    return isValid;
}

function getSelectedRadioValue(radioBtns) {
    let val;
    for (let i = 0; i < radioBtns.length; i++) {
        if (radioBtns[i].checked) {
            val = radioBtns[i].value;
            break;
        }
    }
    return val;
}

