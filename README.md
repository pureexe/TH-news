# TH-news
TH-news เป็นเว็บไซต์ที่ใช้ในการเล่นสนุก April Fool's Day เพื่อปล่อยข่าวปลอมผ่านระบบ Open Graph ของเฟสบุ๊คเพื่อเป็นที่ขำขันของกลุ่มเพื่อนคุณ เคยเปิดใช้บริการภายใต่โดเมน [TH-news.ml](http://th-news.ml) ระหว่างวันที่ 30 มีนาคม 2558 ถึง 1 1 เมษายน 2558 โดยระหว่างเปิดมีจำนวนข่าวปลอมถูกแพร่ออกไปมากถึง 47,557ข่าว และจำนวนคลิกเข้าเว็บมากถึง 2,509,043 ครั้ง ปัจจุบัน ยุติการให้บริการเนื่องจากปัญหาหลายด้าน ไม่ว่าจะเป็นโดเมนถูกระงับ หรือมีหลายฝ่ายไม่พอใจกับการมีอยู่ของมัน ถึงอย่างไรก็ตามผมขอปล่อย source code ของโปรแกรมชุดนี้ไว้ให้กับหลายๆท่านที่สนใจอยากศึกษาหรือพัฒนาต่อ โดยผู้จัดทำไม่รับผิดชอบในความเสียหายที่เกิดขึ้นทั้งสิ้น ตามสัญญาอนุญาต MIT
## วิธีการติดตั้ง
TH-news นั้นเดิมทีใช้งานกับ Openshift คุณสามารถสมัครใช้งาน Openshift ให้เพิ่ม Cartridges ของ Node.js และ Mysql แล้วนำโค้ดส่วนนี้ไป deploy หรือแก้ ตัวแปร pool,server_ip และ server_port ให้ตรงกับเซิฟเวอร์ของคุณ โดยหากติดตั้งบนเซิฟเวอร์ของคุณเองแอปจำเป็นต้องมี Mysql และ Node.JS อีกทั้งยังต้องการ blogger สำหรับทำการเพิ่มข้อความ (ในขณะที่ TH-news.ml เปิดใช้งาน เมื่อเพิ่มข่าวใหม่ต้องเพิ่มที่ [pureapp.in.th](https://www.pureapp.in.th/april)
### ตั้งการ Http
ทำการแก้ไขตัวแปรทั้ง 2 ตัวเป็น ip และ port ของเซิฟเวอร์คุณ
``` javascript
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
```
### การตั้งค่า Mysql
ทำการแก้ mysql เป็นการตั้งค่าของคุณ
``` javascript
var pool  = mysql.createPool({
  host     : process.env.OPENSHIFT_MYSQL_DB_HOST||'127.0.0.1',
  user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME||'root',
  password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD||'root',
  port     : process.env.OPENSHIFT_MYSQL_DB_PORT||3306,
  database : 'april'
});
```
และสร้างตารางชื่อ news โดยมีฟิลด์ดังนี้
- id (integer,primary key,auto increasement)
- title (text)
- description (text)
- image (text)
- view (integer)
- ip (text)
- addtime (TIMESTAMP,default->Timestramp)
- isDelete (TinyInteger)

### แก้ไข ejs
ในโฟลเดอร์ view จะมีไฟล์ ejs อยู่ ให้แก้ทุกอย่างที่เป็น th-news.ml เป็นโดเมนของคุณ

### การเพิ่มข่าวใหม่
การเพิ่มข่าวใหม่ให้ TH-news นั้นทำโดยการ ส่งค่า post ไปที่ /add โดยมี parameter ดังนี้
- title (ชื่อของข่าว)
- description (เนื้อข่าว)
- image (รูปประกอบ)

### หาบล็อก 
นำไฟล์ blogger.html เอาโค้ดด้านในไปวางไว้ใน blog ของคุณเพื่อเป็นตัวเพิ่มข่าวใหม่โดยแก้ทุกอย่างที่เป็น th-news.ml เป็นเว็บของคุณ

### เกี่ยวกับ
Pakkapon Phongthawee เผยแพร่ภายใต้การอนุญาต MIT
