# ZRoom Frontend

Dette projekt er en frontend-applikation til ZRoom – et bookingsystem til reservation af studierum. Applikationen er bygget med **Vue 3**, **Bootstrap 5** og kommunikerer med en RESTful backend-API.

## Funktioner

- **Login**: Brugere skal logge ind for at få adgang til systemet.
- **Forside (FrontPage)**: 
  - Se og vælg dato for booking.
  - Se ledige rum og book dem i ledige tidsintervaller.
  - Tidsintervaller vises som dropdown, og farver indikerer om rummet er ledigt eller optaget.
- **Booking**:
  - Book et rum og vælg tidsinterval.
  - Tilføj medlemmer til din booking.
  - Bekræft booking via modal.
- **Min Side (MyPage)**:
  - Se dine personlige oplysninger.
  - Se og annuller dine reservationer.
- **Navigation**: Genanvendelig navbar på alle sider.
- **Fejlhåndtering**: Visning af fejl- og succesbeskeder.
- **Session-håndtering**: Automatisk redirect til login ved udløbet session.

## Mappestruktur

```
VRoom-Frontend/
│
├── Components/
│   ├── SharedNavbar.js
│   └── ConfirmModal.js
│
├── Js/
│   ├── AxiosCRUD.js
│   ├── FrontPage.js
│   ├── Booking.js
│   └── MyPage.js
│
├── Css/
│   └── Styles.css
│
├── FrontPage.html
├── Booking.html
├── MyPage.html
└── index.html
```

## Installation & Kørsel

1. **Klon projektet**:
   ```sh
   git clone <repo-url>
   cd VRoom-Frontend
   ```

2. **Start en lokal server** (f.eks. med VS Code Live Server eller Python):
   ```sh
   # Med Python 3.x
   python -m http.server 5500
   ```

3. **Åbn i browser**:
   Vi har testet i "live server" extention i VS code.

4. **Backend**:
   Sørg for at backend-API’en kører og er tilgængelig på den URL, der er angivet i `Js/AxiosCRUD.js` (`API_URL`).

## Vigtige Filer

- **FrontPage.html / FrontPage.js**: Hovedsiden for booking af rum.
- **Booking.html / Booking.js**: Side til at gennemføre og bekræfte en booking.
- **MyPage.html / MyPage.js**: Brugerside med oversigt over egne bookinger.
- **AxiosCRUD.js**: Indeholder alle API-kald og håndterer authentication headers.
- **ConfirmModal.js**: Genanvendelig modal-komponent til bekræftelser.

## Teknologier

- [Vue 3 (CDN)](https://vuejs.org/)
- [Bootstrap 5](https://getbootstrap.com/)
- [Axios (CDN)](https://axios-http.com/)
- Vanilla JavaScript

## Tips til fejlfinding

- **MIME-type fejl**: Tjek at alle imports og script-tags peger på de rigtige filnavne og stier.
- **CORS/401-fejl**: Sørg for at være logget ind, og at backend accepterer dine requests.
- **API URL**: Tjek at `API_URL` i `AxiosCRUD.js` matcher din backend.

## Forfattere

- Ø'erne

---

**Bemærk:**  
Dette projekt er kun frontend. Backend skal køre separat og levere de nødvendige endpoints.
- [Vores BackEnd](https://github.com/OBrixvig/ZRoom-Backend-api)
- [Vores Raspberry PI](https://github.com/OBrixvig/VRoom-Raspberry-Pi)
