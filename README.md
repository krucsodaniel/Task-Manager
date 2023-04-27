# Task Manager

A projekt egy webalapú feladatkezelő felület. A felhasználók regisztráció után egy saját felületen kezelhetik a listáikat és a hozzájuk tartozó feladatokat. Az alkalmazás lehetővé teszi a felhasználók számára, hogy rendszerezzék és nyomon kövessék a feladataikat, megkönnyítve ezzel a napi munkafolyamatok irányítását. A platform segítségével a felhasználók szervezettek maradhatnak és összpontosíthatnak a feladataikra, növelve ezzel termelékenységüket és hatékonyságukat. A platform előnyös lehet olyan egyének vagy csapatok számára, akik szeretnének a feladataik élén maradni és hatékonyan kezelni a munkaterhelésüket.

# Technikai követelmények, előírások
-	Az alkalmazás Angular-alapú
-	A dizájnért a Bootstrap és az SCSS felel
-	Adatbázis: MongoDB (NoSQL)
-	NodeJS: saját API szolgálja ki a frontendet
-	Minden API controllerhez egy JEST unit teszt kapcsolódik
-   Minden végponthoz egy integrációs teszt tartozik
-	Az API-hoz Swagger alapú dokumentáció tartozik
-	A felület bizonyos oldalai csak belépés után elérhetőek
-	Az alkalmazás dockerizálva van, konténerből futtatható

# Az alkalmazás előkészítése
- A célgépre le kell klónozni az adott GitHub repository tartalmát:
https://github.com/krucsodaniel/taskManager.git
    - Github felületén a zöld "Code" gombra kattintva lehetőségünk van kimásolni a linket
    - Tetszőleges terminál nyitása, dedikált mappába benavigálás
    - Az alábbi parancs kiadása
     ```git clone https://github.com/krucsodaniel/taskManager.git```


## Az alkalmazás előkészítése fejlesztéshez
- Telepíteni kell az alkalmazás függőségeit:
    - Backend
        - A terminálon be kell lépni a /api mappába és futtatni az npm i parancsot
        - Terminálban ```nodemon .\src\app.js``` parancs, backend alkalmazás indítása (A Nodemon folyamatosan nyomonköveti a Backend oldali kódban történő változtatásokat)
    - Frontend
        - A terminálon be kell lépni a /task-manager mappába és futtatni az npm i parancsot
        - Terminálban ```ng s -o``` parancs, a frontend alkalmazás indítása
- (Ha még nincsen fenn a célgépen, akkor telepíteni kell az Angular keretrendszert az npmi i -g @angular/cli paranccsal)

# Az alkalmazás indítása konténerizálva
- A megadott Docker containerek indítása és inicializálása compose segítségével:
    - <a href="https://docs.docker.com/engine/install/" target="_blank">Docker Desktop</a> szoftver letöltése, telepítése 
    - Docker Desktop alkalmazás elindítása
    - A /api mappába belépve a terminálban ki kell adni az ```npm run docker-compose:up``` parancsot
    - Az alkalmazás a http://loclahost:3000/ lesz elérhető
- A Docker konténerek megállítása
    - A ```ctrl + c``` billentyűkombináció segítségével meg tudjuk állítani a Docker terminált
    - A /api könyvtáron belül a terminálban a ```docker-compose down``` parancs kiadása. Ez leállítja és eltávolítja a docker-compose fájl által létrehozott összes konténert, hálózatot és kötetet.

    
# Tesztek futtatása
- A /api mappába belépve van lehetőség a teszteket futtatni.
- Unit tesztek futtatása előtt a /api mappában szükséges az ``` npm i``` parancs kiadása
- Integrációs tesztek futtatása előtt a /api mappában szükséges az ```npm i ``` majd az ```npm run docker-compose:up``` parancs kiadása (Az integrációs tesztek a konténerből futnak)
    - Unit tesztek
        - Lists tesztek: Terminálban ```npm run test:lists``` parancs futtatása
        - Tasks tesztek: Terminálban ```npm run test:tasks``` parancs futtatása
        - Users tesztek: Terminálban ```npm run test:users``` parancs futtatása
    - Integrációs tesztek
        - Integrációs tesztek: Terminálban ```npm run test:supertest``` parancs futtatása
    - Összes teszt futtatása egyszerre
        - Összes teszt: Terminálban ```npm run test``` parancs futtatása

# API végpontok
| Végpont | Metódus | Leírás |
|----------|--------|-------------|
| `/api/users` | POST | Felhasználó regisztrálás |
| `/api/login` | POST | Felhasználó bejelentkezés |
| `/api/lists` | POST | Új Lista létrehozása |
| `/api/:ownerId` | GET | User ID alapján összes lista lekérdezése |
| `/api/:listId` | DELETE | Lista törlése ID alapján |
| `/api/:listId/tasks` | GET | Összes Task lekérdezése adott List ID alapján |
| `/api/:listId/tasks` | POST | Új Task hozzáadása adott List ID listához |
| `/api/:listId/tasks/:taskId` | PUT | Adott Listában található Task módosítása ID alapján |
| `/api/:listId/tasks/:taskId` | DELETE | Adott Listában található Task törlése ID alapján |

### **Swagger dokumentáció**
localhost:3000/api/api-docs

# Entitások

## User
A regisztrált felhasználó. Készíthet új List-et, törölheti azt, valamint hozzáadhat, módosíthat és törölhet Task-ot.

Tárolt adatok:
- E-mail
- Jelszó
- Becenév
- Listák (ID lista)

## List
A felhasználó által létrehozott lista. Tartalmazza a hozzá tartozó Task-okat.

Tárolt adatok:
- Cím
- Tulajdonos (User ID alapján)
- Taskok (ID lista)

## Task
A felhasználó által létrehozott feladat.

Tárolt adatok:
- Cím
- Lista ID (List ID alapján)
- Állapot (elkészült/nem készült el)

# User story lista, feladatok
A felhasználó regisztrál és/vagy belép az alkalmazásba
- Regisztrációs képernyő megvalósítása -> API regisztrációs végpont implementálása (POST api/users)
- Login képernyő megvalósítása -> API login végpont implementálása (POST api/login)
- JWT autentikáció implementáció, kliens oldali hozzáférés szabályozása autentikáció alapján

A felhasználó új listát ad hozzá
- Új lista hozzáadása az "Add List" gomb megnyomásával, Lista nevének megadása (POST api/lists)

A felhasználó új Task-ot ad egy listához
- Új Task hozzáadása az "Add Task" gomb megnyomásával, Task nevének megadása (POST api/:listId/tasks) [Ahhoz, hogy új Taskot hozzon létre, szükséges kiválasztani egy listát]

A felhasználó elvégez egy Task-ot
- A felhasználó a Task-ra kattintva "completed" státuszra teheti a Taskot. Ilyenkor a Task színe zöldre vált. Ha ismét rákattint, a "completed" státusz eltűnik róla, a Task visszakapja az eredeti fehér színét. (PUT api/:listId/tasks/:taskId)

A felhasználó töröl egy Task-ot
- A felhasználó a Task-on található piros törlés gomb segítségével törölhet Taskot. (DELETE api/:listId/tasks/:taskId)

A felhasználó kilép az alkalmazásból
- A felhasználó a jobb felső sarokban található "Logout" gombra kattintva kilép az alkalmazásból, átirányul a Login képernyőre

# Képernyők, User journey

## *Autentikáció nélkül* elérhető oldalak
### **Főoldal**
Az alkalmazás megnyitását követően a felhasználó a Főoldal-al találkozik először.
A felhasználó beírja a weboldal URL-címét a böngészőjébe, és a kezdőlapon landol.
Átfutja az oldalt, és egy világos és tömör leírást lát a szolgáltatásról, valamint egy vizuálisan vonzó képet, amely a terméket reprezentálja.
Elolvassa a szoltáltatás leírást és megnézi a képet, hogy eldöntse, a szolgáltatás megfelel-e az igényeinek.
Ha érdekli a termék, akkor a "Get started" gombra kattintva átnavigál az Árak oldalra.
### **Árak**
A felhasználó a weboldal Árak oldalára navigál, hogy megtalálja az igényeinek megfelelő csomagot.
Három árképzési lehetőséget lát: Starter, Premium és Pro. Jelenleg csak a Starter csomag érhető el.
Átnézi az árképzés részleteit, és úgy dönt, hogy az Starter csomag megfelel az igényeinek.
Rákattint az Starter csomagra, és a Regisztráció oldalra navigál, ahol létrehozhat egy fiókot.

### **Regisztráció**
A felhasználó a Regisztráció oldalára navigál, hogy felhasználói fiókat hozzon létre.
Megadja az e-mail címét, és létrehoz egy jelszót és egy Becenevet, hogy regisztrálhasson az Starter csomagra.
A rendszer jelzi a sikeres regisztrációt, a Login gombra kattintva a felhasználó átnavigál a Bejelentkezés felületre.

### **Bejelentkezés**
A felhasználó a weboldal bejelentkezési oldalára navigál, hogy hozzáférjen a fiókjához.
Lát egy bejelentkezési űrlapot, amely az e-mail címét és a jelszavát kéri.
Beírja az e-mail címét és a jelszavát, majd a "Login" gombra kattint.
A weboldal hitelesíti az e-mail címét és a jelszavát, és átirányítja őt a fiókja kezdőlapjára.

### **404 - Az oldal nem található**
A felhasználó a weboldalon böngészik, és egy nem létező oldalra mutató linkre navigál.
Egy 404-es hibaoldalra irányítják át, amely elmagyarázza, hogy az oldal nem található.
A 404-es hibaoldal egyértelmű üzenetet tartalmaz arról, hogy a kért oldal nem létezik, valamint egy linket a weboldal kezdőlapjára.
A felhasználó rákattint a "Home page" gombra, és átirányítják a honlap főoldalára.
Tovább böngészi a weboldalt, és megtalálja a keresett információt.

## *Autentikációval* elérhető oldalak
### **Dashboard**
A felhasználó bejelentkezik a weboldalra, és átirányítják a Dashboard oldalra.
A Dashboard oldalon megjelenik a meglévő listák listája és egy űrlap új lista felvételéhez.

### **Lista műveletek**
A felhasználó hozzáad egy új listát az "Add List" gomb segítségével, és a lista megjelenik a Dashboardon.
A felhasználó rákattint az újonnan hozzáadott listára, ami megjeleníti a listához tartozó Task-okat.
A felhasználó a lista neve mellett található "X"-re kattintva törli a listát. A lista törlése az összes hozzá tartozó Task-ot szintén törli.

### **Task műveletek**
A felhasználó új feladatot ad hozzá a listához az "Add Task" gomb segítségével. Új Task hozzáadása csak akkor lehetséges, ha ki van választva egy lista.
A feladatot katitntással befejezettnek jelöli.
A felhasználó a piros törlés gombbal törli a feladatot a listáról, és az eltűnik a lista oldaláról.


