# DO'KONIM POS — WEB PRO VERSIYA

Kompyuter va noutbuk brauzerida (Chrome, Edge, Opera) ishlaydigan kassa dasturi.
Telefon bilan Firebase orqali real vaqtda sinxronlanadi.

## Imkoniyatlar
- **Kassa:** USB skaner bilan ishlash, savat, chegirma, naqd / karta / dollar / aralash / qarz, qaytim hisobi.
- **Skaner:** kursor qayerda bo'lmasin, kod avtomatik qidiruv maydoniga tushadi. Skaner bo'lmasa, telefon kamerasi (Chrome / Android).
- **Chek (Xprinter XP-80T, 80 mm):** faqat chekning o'zi chop etiladi. Sozlamalarda manzil, telefon, pastki yozuv, 58/80 mm tanlash.
- **Ta'minotchilar:** qo'shish, tahrirlash, o'chirish. Har biri bo'yicha ombor qoldig'i, sotilgan soni, tushum va foyda. Mahsulotga biriktiriladi va qidiruvda ishlaydi.
- **Barcode yorlig'i:** haqiqiy Code128 shtrix-kod, narx va nom bilan. Nusxa soni tanlanadi. Kodi yo'q mahsulotga to'g'ri EAN-13 kod avtomatik beriladi.
- **Tezkor tugmalar:** F1 tezkor sotuv, F2 / F9 sotuvni yakunlash, F3 qidiruv, Esc yopish.
- **Kassa smenasi:** smena ochish (boshlang'ich naqd), yopish (sanalgan naqd bilan farq), 80 mm Z-hisobot, smenalar tarixi. Sozlamalarda "smena majburiy" rejimi bor.
- **Savdo tarixi, qaytarish, xarajatlar, qarzdorlar, CSV eksport, zaxira nusxa (ta'minotchilar bilan).**
- **APK / EXE yuklash havolalari:** Sozlamalarda kiritiladi, yuqori paneldan bir bosishda ochiladi.
- **Hisobotlar** faqat telefon ekranida ko'rinadi (kompyuterda yashirin).

## Katta hajmli ma'lumot (IndexedDB)
- Ma'lumot brauzerning katta xotirasiga (IndexedDB) saqlanadi: o'n minglab sotuv bemalol sig'adi.
- Eski versiyadagi ma'lumot birinchi ochilishda **avtomatik ko'chiriladi** (nusxa tekshirilgandan keyin eskisi o'chadi).
- Savdo tarixi 100 tadan ko'rsatiladi: qidiruv, sana filtri va "Yana ko'rsatish" tugmasi bor.
- Sozlamalar > "Xotira holati" kartasida ishlatilgan joy ko'rinadi.
- Muhim: ma'lumot shu brauzerda saqlanadi. Brauzer ma'lumotlarini tozalasangiz yoki boshqa brauzer/manzildan ochsangiz, u ko'rinmaydi. Zaxira nusxani muntazam oling.

## Ishga tushirish
1. `index.html` ni Chrome'da oching (yoki istalgan xostingga yuklang).
2. Sozlamalar > Firebase: Shop ID, Email, Parol (telefondagi bilan bir xil) > "Bulutga ulanish".
3. Xostingga qo'ysangiz, domenni Firebase Console > Authentication > Settings > Authorized domains ga qo'shing.

## Chek / yorliq chop etish
Printer oynasida: Qog'oz **80mm**, Margins **None**, Scale **100%**.
Oynasiz chop etish uchun Chrome'ni `--kiosk-printing` bilan ishga tushiring yoki desktop (.exe) versiyadan foydalaning.

Yorliqlar uchun skaner ishonchli o'qishi uchun kodni raqamli (EAN-13) qilish tavsiya etiladi: lotin bo'lmagan harflar shtrix-kodga chiqmaydi.
