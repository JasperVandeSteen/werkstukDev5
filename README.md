# werkstukDev5

///////////////////////////
                         //
DATABASE STARTUP - DEV5  //
                         //
///////////////////////////


-------->>
STARTUP
-------->>

    1. MAAK DE .ENV FILE
        Vooraleer het project opgestart kan worden moet de enviormental file (.env) aangemaakt worden.
        In de .env file komt dit:
        //---------------------------------
            PORT=5432                    
            APIPORT=8000                 
            API_NAME=werkstukAPI         
            POSTGRES_PASSWORD=rootUser   
            POSTGRES_USER=postgres       
            POSTGRES_DB=postgres
        //---------------------------------

    2. RUN DOCKER COMMANDS
        Om de docker images en containers te bouwen en te runnen wordt volgende command uitgevoerd:
            -> docker-compose up --build

        Als je hierna nog testen wilt runnen worden volgende commands uitgevoerd:
            -> docker-compose down (optioneel)
            -> docker compose up --build -d


---------->>
ENDPOINTS
---------->>

------------> [ http://localhost:8000/pgData/users ] <------------

    1. GET
        => Geeft een lijst terug met alle users
        Heeft geen parameters of body

    2. POST
        => Maakt een nieuw element aan in de users lijst
        De body ziet er alsvolgt uit:
        //----------------------------
           {                        
               "naam": NAAM HIER,   
               "email": EMAIL HIER  
           }                        
        //----------------------------

/:id
=> Meegegeven parameter is een id van een bestaande user

    1. GET
        => Geeft de gekozen user terug op basis van de id
        Heeft geen extra parameters of body

    2. PATCH
        => Update de gekozen user met nieuwe parameters
        De body ziet er alsvolgt uit:
        //----------------------------
           {                        
               "naam": NAAM HIER,   
               "email": EMAIL HIER  
           }                        
        //----------------------------

    3. DELETE
        => Verwijderd de gekozen user uit de database
        Heeft geen extra parameters of body


----------> [ http://localhost:8000/pgData/festivals ] <----------

    1. GET
        => Geeft een lijst terug met alle festivals
        Heeft geen parameters of body

    2. POST
        => Maakt een nieuw element aan in de festivals lijst
        De body ziet er alsvolgt uit:
        //-----------------------------------
           {                               
               "naam": NAAM HIER,          
               "genre": GENRE HIER,        
               "guestlist": GUEST INT HIER 
           }                               
        //-----------------------------------

/:id
=> Meegegeven parameter is een id van een bestaand festival

    1. GET
        => Geeft de gekozen festival terug op basis van de id
        Heeft geen extra parameters of body

    2. PATCH
        => Update het gekozen festival met nieuwe parameters
        De body ziet er alsvolgt uit:
        //-----------------------------------
           {                               
               "naam": NAAM HIER,          
               "genre": GENRE HIER,        
               "guestlist": GUEST INT HIER 
           }                               
        //-----------------------------------

    3. DELETE
        => Verwijderd het gekozen festival uit de database
        Heeft geen extra parameters of body