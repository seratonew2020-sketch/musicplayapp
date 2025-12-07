#!/bin/bash
# Firebase App Hosting Backend Management Commands
# สำหรับ Music Player App

PROJECT_ID="musicplay-d9231"
BACKEND_ID="upmusic"

echo "🚀 Firebase App Hosting Backend Management"
echo "Project: $PROJECT_ID"
echo "Backend: $BACKEND_ID"
echo ""

# ฟังก์ชันแสดงเมนู
show_menu() {
    echo "เลือกคำสั่ง:"
    echo "1) ดูรายการ Backends"
    echo "2) ดูรายละเอียด Backend"
    echo "3) Deploy Backend"
    echo "4) ดู Logs"
    echo "5) ดู Logs (Real-time)"
    echo "6) ดู Environment Variables"
    echo "7) ดู Deployment History"
    echo "8) Exit"
    echo ""
    read -p "เลือก (1-8): " choice
    return $choice
}

# 1. ดูรายการ Backends
list_backends() {
    echo "📋 รายการ Backends:"
    firebase apphosting:backends:list --project $PROJECT_ID
}

# 2. ดูรายละเอียด Backend
get_backend() {
    echo "📊 รายละเอียด Backend:"
    firebase apphosting:backends:get $BACKEND_ID --project $PROJECT_ID
}

# 3. Deploy Backend
deploy_backend() {
    echo "🚀 Deploy Backend..."
    echo "เลือก environment:"
    echo "1) Production (apphosting.production.yaml)"
    echo "2) Staging (apphosting.staging.yaml)"
    echo "3) Default (apphosting.yaml)"
    read -p "เลือก (1-3): " env_choice
    
    case $env_choice in
        1)
            CONFIG="apphosting.production.yaml"
            ;;
        2)
            CONFIG="apphosting.staging.yaml"
            ;;
        3)
            CONFIG="apphosting.yaml"
            ;;
        *)
            CONFIG="apphosting.yaml"
            ;;
    esac
    
    echo "Deploying with config: $CONFIG"
    firebase apphosting:backends:deploy $BACKEND_ID --project $PROJECT_ID --config $CONFIG
}

# 4. ดู Logs
view_logs() {
    echo "📜 Logs:"
    firebase apphosting:backends:logs $BACKEND_ID --project $PROJECT_ID --limit 50
}

# 5. ดู Logs Real-time
view_logs_realtime() {
    echo "📜 Logs (Real-time) - กด Ctrl+C เพื่อออก:"
    firebase apphosting:backends:logs $BACKEND_ID --project $PROJECT_ID --follow
}

# 6. ดู Environment Variables (ต้องใช้ Console)
view_env_vars() {
    echo "🔐 Environment Variables:"
    echo "กรุณาไปที่ Firebase Console เพื่อดู Environment Variables:"
    echo "https://console.firebase.google.com/project/$PROJECT_ID/apphosting/backends/$BACKEND_ID/settings"
}

# 7. ดู Deployment History (ต้องใช้ Console)
view_deployments() {
    echo "📦 Deployment History:"
    echo "กรุณาไปที่ Firebase Console เพื่อดู Deployment History:"
    echo "https://console.firebase.google.com/project/$PROJECT_ID/apphosting/backends/$BACKEND_ID"
}

# Main loop
while true; do
    show_menu
    choice=$?
    
    case $choice in
        1)
            list_backends
            ;;
        2)
            get_backend
            ;;
        3)
            deploy_backend
            ;;
        4)
            view_logs
            ;;
        5)
            view_logs_realtime
            ;;
        6)
            view_env_vars
            ;;
        7)
            view_deployments
            ;;
        8)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ ตัวเลือกไม่ถูกต้อง"
            ;;
    esac
    
    echo ""
    read -p "กด Enter เพื่อกลับไปเมนู..."
    clear
done

