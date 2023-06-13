var fields = Array.from(document.getElementsByClassName('marks-fields'))
var btnGenerateReport = document.getElementById('btn-generate-report')
var tableBody = document.getElementById('table-body');

var rollNumberField = document.getElementById('text-roll-number')
var nameField = document.getElementById('text-name')
var ageField = document.getElementById('text-age')

var TOTAL_MARKS = 500;
var students = localStorage.getItem('studentData') ? JSON.parse(localStorage.getItem('studentData')) : [];
var isUpdateMode = false;
var updatingRecord = -1;

function getData(){
    students = localStorage.getItem('studentData') ? JSON.parse(localStorage.getItem('studentData')) : [];
}
getData();

function setData(){
    localStorage.setItem('studentData', JSON.stringify(students));
}

function createStudent (obtainedMarks) {
    var name = nameField.value;
    var age = ageField.value;
    var rollNumber = rollNumberField.value;
    var student = {
        name,
        age,
        rollNumber,
        obtainedMarks,
        total: calculateSum(obtainedMarks),
    } 
    student.percentage = calculatePercentage(student.total, TOTAL_MARKS)
    student.grade = calculateGrade(student.percentage)
    students.push(student);
    setData();
}

// Order:1
function handleClick () {
    if (isUpdateMode) {
        var updatingStudent = {
            name: nameField.value,
            age: ageField.value,
            rollNumber: rollNumberField.value,
            obtainedMarks: extractMarksFromFields(),
        }
        updatingStudent.total = calculateSum(updatingStudent.obtainedMarks)
        updatingStudent.percentage = calculatePercentage(updatingStudent.total, TOTAL_MARKS)
        updatingStudent.grade = calculateGrade(updatingStudent.percentage)

        students.splice(updatingRecord, 1, updatingStudent)
        generateStudentsData()
        updatingRecord = -1;
        btnGenerateReport.classList.remove('btn-success');
        isUpdateMode = false;
        btnGenerateReport.innerText = 'Add record';
        resetValues();

    } else {
        var obtainedMarks = extractMarksFromFields();
        obtainedMarks.length === fields.length ? createStudent(obtainedMarks) : alert('plz fill all fields.');
        resetValues();
    }
}

function extractMarksFromFields () {
    var obtainedMarks = [];
        fields.forEach(function (field, index) {
            if (field.value === '') {
                // alert('Field ' +(index+1) +' is empty!')
                return;
            } else {
                obtainedMarks[index] = parseFloat(field.value);
            }
        })
    return obtainedMarks
}

function calculateSum (marks) {
    return marks.reduce(function (acc , curr) {
        return acc + curr
    })
}

function calculatePercentage (obtainedMarks, totalMarks) {
    console.log('Obtained marks', obtainedMarks)
    return percentage = (obtainedMarks * 100) / totalMarks;
}

function calculateGrade (percentage) {
    
    if ( percentage > 80) {
        return grade = 'A+';
    } else if (percentage > 70) {
        return grade = 'A';
    } else if (percentage > 60) {
        return grade = 'B'
    } else if (percentage > 50) {
        return grade = 'C'
    } else {
        return grade = 'F'
    }
}

function generateStudentsData () {
    tableBody.innerHTML = ''
    students.forEach(function (student, index) {
        var row = document.createElement('tr');
        
    
        var col12 = document.createElement('td');
        col12.textContent = student.name;
        row.appendChild(col12);
    
        var col22 = document.createElement('td');
        col22.textContent = student.age;
        row.appendChild(col22);
    
        var col32 = document.createElement('td');
        col32.textContent = student.rollNumber;
        row.appendChild(col32);
    
        student.obtainedMarks.forEach(function (mark) {
            var col = document.createElement('td');
            col.textContent = mark;
            row.appendChild(col);
        })
    
        generateTableRow(student.total, row)
        generateTableRow(student.percentage, row)
        generateTableRow(student.grade, row)
        generateActions(row, index)
    
        tableBody.appendChild(row)
    })
}

function deleteRow (index) {
    students.splice(index, 1);
    setData();
    generateStudentsData()
}

function generateTableRow (data, row) {
    var col2 = document.createElement('td');
    col2.textContent = data;
    row.appendChild(col2);
}

function updateRow (index) {
    btnGenerateReport.innerText = 'Update.!'
    btnGenerateReport.classList.add('btn-success');
    updatingRecord = index
    isUpdateMode = true
    nameField.value = students[index].name
    rollNumberField.value = students[index].rollNumber

    fields.forEach(function (field, fieldIndex) {
        field.value = students[index].obtainedMarks[fieldIndex]
    })

}

function generateActions (row, index) {
    var col2 = document.createElement('td');

    // delete button
    var deleteButton = document.createElement('button')
    deleteButton.classList.add('btn', 'btn-danger', 'mx-2')
    deleteButton.onclick = function () {
        deleteRow(index)
    }
    deleteButton.type = 'button'
    deleteButton.innerHTML =  '<ion-icon name="trash-outline"></ion-icon>'

    // update button
    var updateButton = document.createElement('button')
    updateButton.classList.add('btn', 'btn-success')
    updateButton.onclick = function () {
        updateRow(index);
    }
    updateButton.type = 'button'
    updateButton.innerHTML =  '<ion-icon name="pencil-outline"></ion-icon>'

    col2.appendChild(updateButton)
    col2.appendChild(deleteButton)
    // col2.innerHTML = '<button class="btn btn-danger" onClick="deleteRow(index)" type="button"></button>';
    row.appendChild(col2);
}

function resetValues(){
    nameField.value = '';
        ageField.value = '';
        rollNumberField.value = '';
        fields.forEach((field)=>{
            field.value = '';
        })
}

btnGenerateReport.addEventListener('click', function (e) {
    handleClick()
    generateStudentsData()

})

if(students.length){
    generateStudentsData();
}