import qrcode
import json
from datetime import datetime
import os

class AttendanceQRGenerator:
    def __init__(self):
        self.qr_dir = "qr_codes"
        if not os.path.exists(self.qr_dir):
            os.makedirs(self.qr_dir)

    def generate_student_qr(self, student_id, student_name, class_name=""):
        """Generate QR code for student attendance"""
        # Create QR data
        qr_data = {
            "type": "attendance",
            "student_id": student_id,
            "student_name": student_name,
            "class_name": class_name,
            "timestamp": datetime.now().isoformat(),
            "action": "check_in"
        }

        # Convert to JSON string
        qr_content = json.dumps(qr_data)

        # Generate QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_content)
        qr.make(fit=True)

        # Create QR code image
        img = qr.make_image(fill_color="black", back_color="white")

        # Save QR code
        filename = f"{self.qr_dir}/student_{student_id}_{student_name.replace(' ', '_')}.png"
        img.save(filename)

        return filename, qr_content

    def generate_class_qr(self, class_id, class_name, subject, teacher_name):
        """Generate QR code for class attendance"""
        qr_data = {
            "type": "class_attendance",
            "class_id": class_id,
            "class_name": class_name,
            "subject": subject,
            "teacher_name": teacher_name,
            "timestamp": datetime.now().isoformat(),
            "action": "start_class"
        }

        qr_content = json.dumps(qr_data)

        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_content)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")

        filename = f"{self.qr_dir}/class_{class_id}_{class_name.replace(' ', '_')}.png"
        img.save(filename)

        return filename, qr_content

    def generate_batch_qr_codes(self, students_data):
        """Generate QR codes for multiple students"""
        generated_qrs = []

        for student in students_data:
            filename, qr_content = self.generate_student_qr(
                student['id'],
                student['name'],
                student.get('class', '')
            )
            generated_qrs.append({
                'student': student,
                'qr_file': filename,
                'qr_content': qr_content
            })

        return generated_qrs

def main():
    """Example usage"""
    generator = AttendanceQRGenerator()

    # Example student data
    students = [
        {"id": "001", "name": "Ahmad Rahman", "class": "XII IPA 1"},
        {"id": "002", "name": "Siti Nurhaliza", "class": "XII IPA 1"},
        {"id": "003", "name": "Budi Santoso", "class": "XII IPS 1"},
        {"id": "004", "name": "Maya Sari", "class": "XII IPS 1"},
        {"id": "005", "name": "Rizki Pratama", "class": "XII Bahasa 1"}
    ]

    print("Generating QR codes for attendance system...")
    print("=" * 50)

    # Generate QR codes for all students
    generated_qrs = generator.generate_batch_qr_codes(students)

    print(f"Generated {len(generated_qrs)} QR codes:")
    print()

    for qr_info in generated_qrs:
        student = qr_info['student']
        print(f"Student ID: {student['id']}")
        print(f"Name: {student['name']}")
        print(f"Class: {student['class']}")
        print(f"QR File: {qr_info['qr_file']}")
        print("-" * 30)

    # Generate class QR code example
    class_filename, class_qr_content = generator.generate_class_qr(
        "MATH101",
        "Matematika XII IPA 1",
        "Matematika",
        "Pak Budi"
    )

    print("
Class QR Code Generated:")
    print(f"Class: Matematika XII IPA 1")
    print(f"Teacher: Pak Budi")
    print(f"QR File: {class_filename}")

    print("
All QR codes saved in 'qr_codes' directory")
    print("You can now print these QR codes for attendance system")

if __name__ == "__main__":
    main()
