var Specials11;
var Type;
var Table67 = [];
var Table61314 = [];
var Table63 = [];
function TakeArgs(){
    Table67 = [];
    Table61314 = [];
    Table63 = [];
    Specials11 = document.querySelectorAll('.spin');
    // Проверка
    Type4 = document.getElementById('type').querySelectorAll('input');
    for(var i = 0; i < Type4.length; i++){
        if(Type4[i].checked){Type = i; break}
    }
    // Проверка
    Tab = document.querySelectorAll('.t67');
    for(var i = 0; i < Tab.length; i++){
        if(Tab[i].checked) Table67.push(Tab[i].value);
    }
    var Select = document.getElementById('t67').querySelectorAll('option');
    for(var i = 0; i < Select.length; i++){
        if(Select[i].selected) {Table67.push(Select[i].value); break}
    }
    // Проверка
    Tab = document.querySelectorAll('.t1314');
    for(var i = 0; i < Tab.length; i++){
        if(Tab[i].checked) Table61314.push(Tab[i].value)
    }
    // Проверка
    Tab = document.querySelectorAll('.t63');
    for(var i = 0; i < Tab.length; i++){
        if(Tab[i].checked) Table63.push(Tab[i].value)
    }
    switch (Table63[1]){
        case 'С':
            Table63[1] = "Симметричное расположение зубьев";
            break;
        case 'НЖ':
            Table63[1] = "Шестерня расположена несимметрично относительно опор, весьма жесткий вал";
            break;
        case 'Н':
            Table63[1] = "Шестерня расположена несимметрично относительно опор, менее жесткий вал";
            break;
        case 'К':
            Table63[1] = "Консольное расположение одного из колес";
            break;
    }
    // Проверка
    DataBase();
}
function DataBase(){
    fetch("../BendingEndurance/Manager.php", {
        method: "POST",
        body: JSON.stringify({
            Mm: Table61314[0],
            n: Table61314[1],
            x1: Table67[0],
            x2: Table67[1],
            Zv: Table67[2],
            Hard: Table63[0],
            RWW: Table63[2],
            GA: Table63[1],
        }),
        headers: { "Content-Type": "application/json" },
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                 console.log("SUPEEER");
                 DataTable = data.data;
                 Calculate(DataTable);
            } else {
                console.log("Еrror");
            }
        });
}
function Calculate(DataTable){
    for(var i = 0; i < DataTable.length; i++) 
        if(DataTable[i] === null) DataTable[i] = 0;
    g0 = DataTable[3];
    switch (Type){
        case 0:
        case 1:
            delta_F = 0.006;
            break;
        case 2:
            delta_F = 0.011;
            break;
        case 3:
            delta_F = 0.016;
            break;
    }
    WFv0 = delta_F * g0 * Specials11[5].value * 
    Math.sqrt(Specials11[2].value / Specials11[4].value).toFixed(3);
    WFv = DataTable[4];
    if(WFv > WFv0) WFv = WFv0;
    KF_beta = DataTable[0]; 
    nt = Table61314[1];
    if(nt < 5) nt = 5;
    switch (Type){
        case 0:
            if(Specials11[9].value <= 1) KF_alpha = 1;
            else KF_alpha = (4 + (Specials11[1].value - 1) * (nt - 5)) / (4 * Specials11[1].value);
            break;
        case 1:
            KF_alpha = 1;
            break;
        case 2:
        case 3:
            KF_alpha = 1;
            break;
    }
    KFv = 1 + (WFv * Specials11[0].value / (Specials11[6].value * KF_alpha * KF_beta));
    WFt = (Specials11[6].value / Specials11[0].value) * KF_alpha * KF_beta * KFv;
    sigma_FP1 = Specials11[7].value;
    sigma_FP2 = Specials11[8].value;
    var YF1 = DataTable[1];
    var YF2 = DataTable[2];
    m = Specials11[3].value; 
    switch (Type){
        case 0:
        case 1:
        case 2:
        case 3:
            Ye = 1;
            break;
    }
    switch (Type){
        case 0:
        case 1:
            Yb = 1 - (Specials11[10].value / 140);
            break;
        case 2:
        case 3:
            Yb = 1;
            break;
    }
    var A1 = sigma_FP1 / YF1;
    var A2 = sigma_FP2 / YF2;
    var A = Math.min(A1,A2);

    var YF;
    if(A == A1) {sigma_FP = sigma_FP1 * 1; YF = YF1 * 1;}
    if(A == A2) {sigma_FP = sigma_FP2 * 1; YF = YF2 * 1;}

    sigma_F = (YF * Ye * Yb * WFt) / m;
    
    var Value = [sigma_F.toFixed(3), sigma_FP.toFixed(3), YF.toFixed(3), A.toFixed(3),  A1.toFixed(3), 
             A2.toFixed(3),Yb.toFixed(3), WFt.toFixed(3), KFv.toFixed(3), 
             KF_alpha.toFixed(3), WFv.toFixed(3), WFv0.toFixed(3)];
    var Name = ["σF","σFP","YF","A","A1","A2","Yβ","ωFt","KFν","КFα","ωFν","ωFν0"];

    DT = {
        V: [DataTable[0],DataTable[1],DataTable[2],DataTable[3],DataTable[4]],
        N: ["KFβ","YF1","YF2","g0","ωFν"]
    }
    ShowAnsw(Name, Value, DT);
}
function ShowAnsw(Name, Value, DT){
    var page = document.getElementById("spform");
    page.innerHTML ='';
    page.innerHTML += '<div class = "Title" style = "width: 100%; height: 50px; background-color: #9C8F8F; border-radius: 5px 0px 0px 5px;">Вычисляемые значения</div>'
    for(var i = 0; i < Value.length; i++){
        page.innerHTML += 
        '<div class = "input">'
        +
        '<div>"'+ Name[i] +'"</div>'  
        +       
        '<input class = "" type="text" name = "" value = "'+ Value[i] +'" readonly>' 
        +
        '</div>';
    }

    page = document.getElementById("DT")
    page.innerHTML ='';
    for(var i = 0; i < DT.N.length; i++){
        page.innerHTML += 
        '<div class = "input">'
        +
        '<div>"'+ DT.N[i] +'"</div>'  
        +       
        '<input class = "" type="text" name = "" value = "'+ DT.V[i] +'" readonly>' 
        +
        '</div>';
    }

    if(Value[0] * 1 > Value[1] * 1){
        Answer1 = "σF > σFP";
        Answer2 = "Полученный расчет имеет нарушения"
    }
    else{
        Answer1 = "σF <= σFP";
        Answer2 = "Полученный расчет является правильным";
    } 

    page = document.getElementById("AG")
    page.innerHTML ='';
    page.innerHTML += 
    '<input class = "answer_input" value="'+ Answer1 +'" readonly>'
    +
    '<input class = "answer_input" value="'+  Answer2 +'" readonly>'
    +
    '<buttom onclick="TakeArgs()" class = "B" style = "color: white; background-color: #9C8F8F;" >Calculate</buttom>';

}