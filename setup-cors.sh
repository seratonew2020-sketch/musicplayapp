#!/bin/bash
# Script สำหรับตั้งค่า CORS ใน Firebase Storage

echo "🔧 กำลังตั้งค่า CORS สำหรับ Firebase Storage..."
echo ""

# ตรวจสอบว่า gsutil ติดตั้งแล้วหรือยัง
if ! command -v gsutil &> /dev/null; then
    echo "❌ gsutil ไม่พบในระบบ"
    echo ""
    echo "กรุณาติดตั้ง Google Cloud SDK:"
    echo "  macOS: brew install google-cloud-sdk"
    echo "  หรือดาวน์โหลดจาก: https://cloud.google.com/sdk/docs/install"
    echo ""
    exit 1
fi

# ตรวจสอบว่า login แล้วหรือยัง
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "⚠️  ยังไม่ได้ login Google Cloud"
    echo "กำลังเปิด browser เพื่อ login..."
    gcloud auth login
fi

# ตั้งค่า project
PROJECT_ID="musicplay-d9231"
BUCKET_NAME="musicplay-d9231.appspot.com"

echo "📦 Project: $PROJECT_ID"
echo "📦 Bucket: $BUCKET_NAME"
echo ""

# ตรวจสอบว่า project ถูกต้อง
gcloud config set project $PROJECT_ID

# ตรวจสอบว่าไฟล์ cors.json มีอยู่
if [ ! -f "cors.json" ]; then
    echo "❌ ไม่พบไฟล์ cors.json"
    exit 1
fi

echo "📄 กำลังอ่าน CORS config จาก cors.json..."
cat cors.json
echo ""

# ตั้งค่า CORS
echo "🔄 กำลังตั้งค่า CORS..."
gsutil cors set cors.json gs://$BUCKET_NAME

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ตั้งค่า CORS สำเร็จ!"
    echo ""
    echo "📋 ตรวจสอบ CORS config:"
    gsutil cors get gs://$BUCKET_NAME
    echo ""
    echo "⏰ CORS จะใช้เวลา 1-2 นาทีในการ propagate"
    echo "💡 หลังจากนั้น:"
    echo "   1. Clear browser cache (Cmd+Shift+R)"
    echo "   2. รีเฟรชหน้า"
else
    echo ""
    echo "❌ เกิดข้อผิดพลาดในการตั้งค่า CORS"
    echo ""
    echo "ลองใช้วิธีอื่น:"
    echo "1. ไปที่ Google Cloud Console:"
    echo "   https://console.cloud.google.com/storage/browser?project=$PROJECT_ID"
    echo "2. เลือก bucket: $BUCKET_NAME"
    echo "3. ไปที่ Configuration → CORS"
    echo "4. คลิก Edit และวาง config จาก cors.json"
    exit 1
fi

