$(document).ready(function() {
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    // โหลดข้อมูลจากไฟล์ math_questions.json
    $.getJSON("question.json", function(data) {
        questions = data; // เก็บข้อมูลคำถามจาก JSON
        console.log("ข้อมูลที่ดึงมา:", questions); // ตรวจสอบข้อมูลที่โหลด
    }).fail(function() {
        console.error("ไม่สามารถโหลดไฟล์ JSON ได้");
    });

    // หน้าเริ่มต้น
    $('#startBtn').click(function() {
        if (questions.length > 0) {
            $('#startPage').hide();
            $('#quizPage').show();
            showQuestion(currentQuestionIndex);
        } else {
            alert("ข้อมูลคำถามยังไม่ได้ถูกโหลด");
        }
    });

    // ฟังก์ชันแสดงคำถามและตัวเลือก
    function showQuestion(index) {
        const questionData = questions[index];
        if (questionData) {
            $('#questionContainer').text(questionData.question); // แสดงคำถาม

            // สร้างตัวเลือกจาก JSON และแสดง
            const optionsHTML = questionData.options.map((option, i) => {
                return ` 
                    <label>
                        <input type="radio" name="option" value="${option}" />
                        ${option}
                    </label><br/>
                `;
            }).join('');

            $('#optionsContainer').html(optionsHTML); // แสดงตัวเลือก
            $('#submitBtn').show(); // แสดงปุ่มส่งคำตอบ
            $('#feedback').hide(); // ซ่อนข้อความ feedback
        } else {
            console.error("คำถามไม่พบ");
        }
    }

    // เมื่อกดปุ่มส่งคำตอบ
    $('#submitBtn').click(function() {
        const selectedOption = $('input[name="option"]:checked').val(); //ดึงตัวเลือกที่เลือก
        if (selectedOption) {
            // แยกแค่ตัวเลือก เช่น "A", "B" ออกจากข้อความ เช่น "A. 3"
            const selectedAnswer = selectedOption.trim().split(".")[0]; 
            const correctAnswer = questions[currentQuestionIndex].answer.trim(); //คำตอบที่ถูกต้อง

            // พิมพ์ค่าของ selectedAnswer และ correctAnswer เพื่อตรวจสอบ
            console.log("คำตอบที่เลือก (selectedAnswer): " + selectedAnswer); //แสดงคำตอบที่เลือก
            console.log("คำตอบที่ถูกต้อง (correctAnswer): " + correctAnswer); //แสดงคำตอบที่ถูกต้อง

            // เปรียบเทียบคำตอบที่เลือกกับคำตอบที่ถูกต้อง
            if (selectedAnswer === correctAnswer) {
                score++; // เพิ่มคะแนนถ้าตอบถูก
                $('#feedback').text('คำตอบถูกต้อง!').css('color', 'green').show(); //แสดงข้อความ "ถูกต้อง"
            } else {
                $('#feedback').text('คำตอบผิด!').css('color', 'red').show(); //แสดงข้อความ "ผิด"
            }
        }

        // ตรวจสอบคำตอบแล้วข้ามไปข้อถัดไป
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            // รอ 1 วินาทีแล้วไปข้อถัดไป
            setTimeout(function() {
                showQuestion(currentQuestionIndex); //ขึ้นคำถามถัดไป
            }, 1000);
        } else {
            // เมื่อทำครบทุกข้อ
            $('#quizPage').hide();
            $('#resultPage').show();
            $('#score').text(score); //ขึ้นคะแนน
        }
    });

    // เริ่มใหม่
    $('#restartBtn').click(function() {
        currentQuestionIndex = 0;
        score = 0;
        $('#resultPage').hide();
        $('#startPage').show();
    });
});
