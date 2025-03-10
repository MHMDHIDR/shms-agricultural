/**
 * A function to replace the string with the arabic string
 * @param string the string to be replaced
 * @returns the replaced string
 * */
export const translateSring = (string: string) => {
  switch (string) {
    case "purchase": {
      return "صفحة شراء الأسهم"
    }
    case "dashboard": {
      return "صفحة لوحة التحكم"
    }
    case "sn": {
      return "الرقم التسلسلي"
    }
    case "id": {
      return "الرقم المعرف"
    }
    case "amount":
    case "withdraw_amount": {
      return "المبلغ المراد سحبه"
    }
    case "projectName":
    case "name": {
      return "الاسم"
    }
    case "projectStatus":
    case "accountStatus":
    case "status":
    case "accounting_operation_status": {
      return "الحالة"
    }
    case "projectLocation": {
      return "موقع المشروع"
    }
    case "projectStartDate": {
      return "تاريخ بداية المشروع"
    }
    case "projectEndDate": {
      return "تاريخ نهاية المشروع"
    }
    case "projectInvestDate": {
      return "تاريخ الاستثمار"
    }
    case "projectProfitsCollectDate": {
      return "تاريخ جمع الأرباح"
    }
    case "projectStudyCase": {
      return "دراسة الجدوى"
    }
    case "projectStudyCaseVisibility": {
      return "ظهور دراسة الجدوى"
    }
    case "projectAvailableStocks": {
      return "الأسهم المتاحة"
    }
    case "projectTotalStocks": {
      return "إجمالي الأسهم"
    }
    case "projectStockPrice": {
      return "سعر السهم"
    }
    case "stocksContract": {
      return "عقد شراء الأسهم"
    }
    case "projectSpecialPercentage": {
      return "نسبة زيادة خاصة"
    }
    case "projectSpecialPercentageCode": {
      return "رمز نسبة الزيادة الخاصة"
    }
    case "projectStockProfits": {
      return "أرباح السهم"
    }
    case "projectName": {
      return "اسم المشروع"
    }
    case "projectDescription": {
      return "وصف المشروع"
    }
    case "projectTerms": {
      return "شروط المشروع"
    }
    case "totalPayment": {
      return "إجمالي المبلغ المدفوع"
    }
    case "totalProfit": {
      return "إجمالي الربح"
    }
    case "totalReturn": {
      return "إجمالي الربح من الأسهم ورأس المال"
    }
    case "stocks": {
      return "عدد الأسهم"
    }
    case "createdAt":
    case "created_at": {
      return "تاريخ الإنشاء"
    }
    case "actions": {
      return "الإجراءات"
    }
    case "active": {
      return "نشط"
    }
    case "pending": {
      return "قيد المراجعة"
    }
    case "block": {
      return "محظور"
    }
    case "userDeleted": {
      return "محذوف"
    }
    case "completed": {
      return "مكتمل"
    }
    case "rejected": {
      return "مرفوض"
    }
    case "email": {
      return "البريد الإلكتروني"
    }
    case "phone": {
      return "رقم الهاتف"
    }
    case "address": {
      return "العنوان"
    }
    case "role": {
      return "الدور"
    }
    case "admin": {
      return "مدير"
    }
    case "user": {
      return "مستخدم"
    }
    case "type":
    case "action_type": {
      return "النوع"
    }
    case "withdraw": {
      return "ســـحب رصيد"
    }
    case "deposit": {
      return "إيـــــــداع رصيد"
    }
    case "currentProfits": {
      return "الربح الحالي"
    }
    case "newProfits": {
      return "الربح الجديد"
    }
    default: {
      return string
    }
  }
}
