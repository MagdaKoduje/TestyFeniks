function randomString(len = 10, type = 'letters') {
    type = type && type.toLowerCase();
    let str = '',
        i = 0,
        min = type == 'letters' ? 10 : 0,
        max = type == 'number' ? 10 : 62;
    for (; i++ < len; ) {
        let r = (Math.random() * (max - min) + min) << 0;
        str += String.fromCharCode((r += r > 9 ? (r < 36 ? 55 : 61) : 48));
    }
    return str;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min)}; // The maximum is inclus
    


let page = "https://feniks.vdpo.pl/patrycja/";

function loginToPage(login = "demo", password = "demo") {
  cy.visit(page); //wejdź na stronę
  cy.get("#37787 table tbody tr:nth-child(1) td:nth-child(1) a").click(); //wybierz jednostkę
  cy.url().should("include", "37787"); // sprawdź czy jesteś na dobrej jednostce
}

let formaPlatnosci = "Forma płatności " + randomString(4, 'number');
let wzorzecOprocentowaniaSkrót = "Skrót wzorca " + randomString(4, 'number');
let wzorzecOprocentowaniaNazwa = "Wzorzec oprocentowania " + randomString(4, 'number');


describe("Testy słownika", function () {
  it("Dodanie formy płatności kartą 10 dni", function () {
    loginToPage();
    cy.get('#ribbon-view-tab-body', {timeout: 10000}).contains('span', 'Słowniki').click() //kliknij Słowniki, timeout czeka 10s
    cy.get('[role="treegrid"]').contains('Formy płatności').click({force: true}); //kliknij Forma płatności, forse true bo detached in DOM
    cy.contains('a', "Dodaj").click(); //Dodaj nową formę płatności
    cy.get('[seleniumid="FormaPlatnosciEditV"] [seleniumid="Nazwa"] input').type(formaPlatnosci); //Uzupełnij nawzwę formę płatności
    cy.get('[seleniumid="FormaPlatnosciEditV"] [seleniumid="Nazwa"]').next().find('input').type("14"); //Uzupełnij liczbę dni
    cy.get('[seleniumid="FormaPlatnosciEditV"] [seleniumid="Termin liczony od"] input') //Termin liczony od - wybieram Data wystawienia
        .click() 
        .invoke('attr', 'data-componentid')
        .then(($dataComponentid) => {
            cy.get("#" + $dataComponentid + "-picker").contains('li', "Data wystawienia").click();
        });

    cy.get('[seleniumid="FormaPlatnosciEditV"] [seleniumid="Typ płatności"] input')  //Typ płatności - wybieram Płatność kartą
        .click()
        .invoke('attr', 'data-componentid')
        .then(($dataComponentid) => {
            cy.get("#" + $dataComponentid + "-picker").contains('li', "Płatność kartą").click();
        });
    cy.get('[seleniumid="FormaPlatnosciEditV"] [seleniumid="Wymagaj konto bankowe kontrahenta na dok. zakupu"] input') //wymagaj konto bankowe  - wybieram NIE
        .click()
        .invoke('attr', 'data-componentid')
        .then(($dataComponentid) => {
            cy.get("#" + $dataComponentid + "-picker").contains('li', "Nie").click();
        });
    cy.get('[seleniumid="FormaPlatnosciEditV"]').contains('a', "Zapisz").click();                          //Zapisuję dodawaną formę płatności
    cy.get('#center-container > div > div:nth-child(3)').contains(formaPlatnosci).should('exist');         //Sprawdzam czy płatność została dodane
});

  it("Edycja dodanej formy płatności kartą 10 dni - zmiana na 20 dni", function () {
    loginToPage();
    cy.get('#ribbon-view-tab-body', {timeout: 10000}).contains('span', 'Słowniki').click() //kliknij Słowniki, timeout czeka 10s
    cy.get('[role="treegrid"]').contains('Formy płatności').click({force: true}); //kliknij Forma płatności, forse true bo detached in DOM  
    cy.get('#center-container > div > div:nth-child(3)').contains(formaPlatnosci).closest('tr').find('td:first-child > div').click() 
    //wybierz formę płatności, która została dodana w tescie "Dodanie formy płatności kartą 10 dni" i ją edytuj
    cy.get('[seleniumid="FormaPlatnosciEditV"] [seleniumid="Nazwa"]').next().find('input').type("20"); //Uzupełnij liczbę dni 20 dni
    cy.get('[seleniumid="FormaPlatnosciEditV"]').contains('a', "Zapisz").click(); //kliknij zapisz
    cy.get('#center-container > div > div:nth-child(3)').contains(formaPlatnosci).should('exist');         //Sprawdzam czy płatność jest na gridzie

});

  it("Usunięcie dodanej formy płatności kartą 10 dni", function () {
    loginToPage();
    cy.get('#ribbon-view-tab-body', {timeout: 10000}).contains('span', 'Słowniki').click() //kliknij Słowniki, timeout czeka 10s
    cy.get('[role="treegrid"]').contains('Formy płatności').click({force: true}); //kliknij Forma płatności, forse true bo detached in DOM  
    cy.get('#center-container > div > div:nth-child(3)').contains(formaPlatnosci).closest('tr').find('td:first-child > div').click() 
    //wybierz formę płatności, która została dodana w tescie "Dodanie formy płatności kartą 10 dni" i ją edytuj
    cy.get('[seleniumid="FormaPlatnosciEditV"]').contains('a', "Usuń").click(); //kliknij usuń
    cy.contains('div', "Czy na pewno chcesz usunąć wybrany element?").closest('[role="alertdialog"]').contains('a', "Tak").click();//Potwierdź usunięcie
    cy.get('#center-container > div > div:nth-child(3)').contains(formaPlatnosci).should('not.exist');         //Sprawdzam czy płatność została usunięta

});

it("Dodanie nowego wzorca oprocentowania", function() {
    loginToPage();
    cy.get('#ribbon-view-tab-body', {timeout: 10000}).contains('span', 'Słowniki').click() //kliknij Słowniki, timeout czeka 10s
    cy.get('#center-container').contains('div', "Wzorce oprocentowania").click({force: true});//kliknij Wzorce oprocentowania w lewym menu
    cy.get('#center-container').contains('a', "Dodaj").click(); //dodaj nowy wzorzec orpocentowania
    cy.get('[seleniumid="WzorzecOprocentowaniaEditV"]').should('be.visible') //okno dodawania wzorca powinno być widoczne
    cy.get('[seleniumid="Skrót"] input').type(wzorzecOprocentowaniaSkrót); //uzupełniam nazwę skrótu wzorca oprocentowania
    cy.get('[seleniumid="Nazwa"] input').type(wzorzecOprocentowaniaNazwa); //uzupełniam nazwę nazwy wzorca oprocentowania
    cy.get('[seleniumid="Obowiązuje od"]').next('div').find('input').type("15"); //uzupełniam stopę procentową
    cy.get('[seleniumid="WzorzecOprocentowaniaEditV"]').contains('a', "Zapisz").click(); //klikam zapisz
    cy.get('#center-container').contains(wzorzecOprocentowaniaSkrót).should('be.visible'); //sprawdzam czy dodany wzorzec orpocentowania jest widoczny na gridzie
});

it("Edycja nowego wzorca oprocentowania", function() {
    loginToPage();
    cy.get('#ribbon-view-tab-body', {timeout: 10000}).contains('span', 'Słowniki').click() //kliknij Słowniki, timeout czeka 10s
    cy.get('#center-container').contains('div', "Wzorce oprocentowania").click({force: true});//kliknij Wzorce oprocentowania w lewym menu
    cy.get('#center-container').contains(wzorzecOprocentowaniaSkrót).closest('tr').find('td:first-child').click(); //wybieram dodany wzorzec oprocentowania
    cy.get('[seleniumid="Dane podstawowe"]').contains('a', "Zmień").click({force: true}); //w danych podstawowych wybieram Zmień
    cy.get('[seleniumid="Rodzaj stopy proc."] div[id$="trigger-picker"]	') //Rozwijam combo
    .click()
    cy.get('[seleniumid="Rodzaj stopy proc."] input')                      //Rodzaj stopy procentowej zmieniam z Rocznej na Dzienna
    .invoke('attr', 'data-componentid')
    .then(($dataComponentid) => {
        cy.get("#" + $dataComponentid + "-picker").contains('li', "Dzienna").click();
    });
    cy.get('[seleniumid="WzorzecOprocentowaniaEditV"]').contains('a', "Zapisz").click(); //klikam zapisz
    cy.get('#center-container').contains(wzorzecOprocentowaniaSkrót).should('be.visible'); //sprawdzam czy dodany wzorzec orpocentowania jest widoczny na gridzie
});

it("Usunięcie nowego wzorca oprocentowania", function() {
    loginToPage();
    cy.get('#ribbon-view-tab-body', {timeout: 10000}).contains('span', 'Słowniki').click() //kliknij Słowniki, timeout czeka 10s
    cy.get('#center-container').contains('div', "Wzorce oprocentowania").click({force: true});//kliknij Wzorce oprocentowania w lewym menu
    cy.get('#center-container').contains(wzorzecOprocentowaniaSkrót).closest('tr').find('td:first-child').click(); //wybieram dodany wzorzec oprocentowania
    cy.get('[seleniumid="Dane podstawowe"]').contains('a', "Zmień").click({force: true}); //w danych podstawowych wybieram Zmień
    cy.get('[seleniumid="WzorzecOprocentowaniaEditV"]').contains('a', "Usuń").click(); //klikam usuń
    cy.contains('div', "Czy na pewno chcesz usunąć wybrany element?").closest('[role="alertdialog"]').contains('a', "Tak").click();//Potwierdź usunięcie
    cy.get('#center-container > div > div:nth-child(3)').contains(wzorzecOprocentowaniaSkrót).should('not.exist');         //Sprawdzam czy płatność została usunięta
});

});

describe("Testy jednostki", function () {
    it("Zmiana Urzędu Skarbowego", function () {  //ten do zrobienia, problem mam z combo
        loginToPage();
        cy.get('#ribbon-view-innerCt', {timeout: 10000}).contains('a', "Jednostka").click(); //klikam w jednostkę, czekaj 10s
        cy.get('#ribbon-view-tab-body').contains('a', "Dane identyfikacyjne").click(); //wybieram dane identyfikacyjne
        cy.get('[seleniumid="Dane identyfikacyjne"]').contains('a', "Zmień").click().wait(2000); //wybieram Zmień
        cy.get('[seleniumid="Urząd skarbowy"] > div > div > div:nth-child(2)').click().wait(5000);  //naciskam przycisk rozwijający combo 
        let urzadSkarbowy = getRandomIntInclusive(1, 44); //zdefiniowanie zmiennej, która wybiera losowy numer urzędu 
        cy.get('.x-grid-body.x-panel-body-default.x-panel-body-default table:nth-child(' + urzadSkarbowy + ')').click({force: true}); //wybranie losowego urzedu
        cy.get('[seleniumid="DaneIdentyfikacyjneEditV"]').contains('a', "Zapisz").click(); //Zapisanie zmiany
        //todo: Trzeba dopisać asercję sprawdzającą czy wybrany urząd pojawił się na gridzie

    
    });
    it("Zmiana nr telefonu w danych dodatkowych jednostki", function () {
        loginToPage();
        cy.get('#ribbon-view-innerCt', {timeout: 10000}).contains('a', "Jednostka").click(); //klikam w jednostkę, czekaj 10s
        cy.get('#ribbon-view-tab-body').contains('a', "Dane identyfikacyjne").click(); //wybieram dane adresowe
        cy.get('[seleniumid="Dane adresowe"]').contains('a', "Zmień").click(); //wybieram Zmień
        cy.get('[seleniumid="Telefon komórkowy"] input').clear();  
        let numerTelefonu = randomString(9,'number');
        cy.get('[seleniumid="Telefon komórkowy"] input').type(numerTelefonu);
        cy.get('[seleniumid="DaneAdresoweEditV"]').contains('a', "Zapisz").click();
        cy.get('[seleniumid="Dane adresowe"]').contains(numerTelefonu).should('exist');

});
});

describe('Dokumnety źródłowe', function() {
    it("Dodanie Faktury VAT sprzedaży", function () {
        let wartoscCombo = '.x-panel.x-layer.x-panel-default.x-grid.x-border-box[aria-hidden="false"] .x-grid-body';
        loginToPage();
        cy.get('#ribbon-view-innerCt', {timeout: 10000}).contains('a', "Dokumenty źródłowe").click(); //klikam w Dokumenty źródłowe
        cy.get('#ribbon-view-tab-body').contains('a', "Dokumenty sprzedaży").click(); //klikam Dokumnety sprzedaży
        let biezacyRok = new Date().getFullYear();
        cy.get('[seleniumid="Rok"] input')      //zmieniam rok na bieżący
        .invoke('attr', 'value', biezacyRok)
        .should('have.attr', 'value', biezacyRok);
        //pierwsze okno dokumentu
        cy.get('#center-container').contains('a', "Dodaj").click();  //Klikam Dodaj
        cy.get('[seleniumid="Wzorzec numeracji"] input').type('{downArrow}').wait(10000);  //klikam w input pola Wzorzec numeracji, strzałka w dół
        cy.get(wartoscCombo + " " + 'table:first-child tr td:first-child div').wait(1000).click();
        cy.get('[seleniumid="Kontrahent"] input').type('{downArrow}'); //klikam w input pola Kontrahent, strzałka w dół
        cy.get(wartoscCombo + " " + 'table:first-child tr td:first-child div').click({force: true}); //wybieram pierwszego kontrahenta z listy 
        cy.get('[seleniumid="Dokument płatności masowych (MPT)"] input').type('{downArrow}')//klikam w input pola dokument płatności masowych MPT, strzałka w dół
        .invoke('attr', 'data-componentid')                                                          //Wartość pola zmieniam z TAK na NIE
        .then(($dataComponentid) => {
            cy.get("#" +  $dataComponentid + "-picker").contains('li', "Nie").click();
        });
        cy.get('[seleniumid="Forma płatności"] input').type('{downArrow}'); //klikam w input pola Forma płatności, strzałka w dół
        cy.get(wartoscCombo).contains("Forma płatności").click({force:true}); //wybranie formy płatności "Forma płatności"
        cy.get('[seleniumid="Dziennik"] input').type('{downArrow}'); //wybieram input pola Dziennik, strzałka w dół
        let dziennik = getRandomIntInclusive(1,10); //zdefiniowanie zmiennej, dla której wybieramy losowy numer dziennika 
        cy.get(wartoscCombo + " " + ' table:nth-child(' + dziennik + ') tr td:first-child div').click(); //wybieram losowy dziennik
        cy.get('[seleniumid="DokumentSprzedazyInformacjeOgolneEditV"]').contains('a', "Dalej").click(); //kliknięcie przyciska Dalej
        
        //drugie okno dokumentu
        cy.get('.x-field-toolbar.x-hbox-form-item.x-form-dirty input').click() //klikam w inputa pola Przeliczenie VAT
        .invoke('attr', 'data-componentid')                                                          //wybieram wartość Od netto do pola Przeliczenie VAT
        .then(($dataComponentid) => {
            cy.get("#" +  $dataComponentid +"-picker-listWrap").contains('li', "Od netto").click({force: true});
        });
        cy.get('.x-grid-cell-ncolumn-1369.x-grid-cell-first.x-unselectable').click(); //wprzejscie do komórki Nazwa towaru i usługi
        cy.get('.x-form-text-field-body-grid-cell input').type("Nazwa towaru/usługi 1"); //wpisanie do inputa nazwy towaru/usługi
        cy.get('.x-grid-cell-ncolumn-1369.x-grid-cell-first.x-unselectable').nextAll('td:nth-child(4)').click(); 
        cy.get('.x-form-text-wrap-focus input').type("1000"); //wpisanie do inputa kwoty netto 1000
        cy.get('.x-window.x-layer.x-window-default.x-border-box[aria-hidden="false"]').contains('a:nth-child(5)', "Zapisz").click(); //Kliknij Zapisz 
        cy.get('.x-container.x-border-item.x-box-item.x-container-default.x-border-layout-ct').contains('a', "Ogólne").should('have.attr', 'aria-selected', "true"); 
        //sprawdzenie czy po zapisaniu dokument otworzył się na zakładce Ogólne

    });
});
