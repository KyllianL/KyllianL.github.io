function createlogin() {
  let body = document.body; // Récupère l'élément body du document
  let FormConn = document.createElement("form"); // Crée un élément <form>
  FormConn.id = "FormConn"; // Attribue un ID à ce formulaire
  
  // Création de la div et du titre du formulaire
  let DivTitle = document.createElement("div"); 
  DivTitle.id = "Title"; // ID pour la div contenant le titre
  let Title = document.createElement("h1"); 
  Title.id = "IntraTitle"; // ID pour le titre
  Title.innerText = "Intra GraphQl";

  // Création champ de saisie pour l'utilisateur
  let Users = document.createElement("input");
  Users.id = "AreaUser"; // ID champ utilisateur
  Users.type = "texte";
  Users.required = true; // Champ obligatoire

  // Label champ utilisateur
  let TextUser = document.createElement("label");
  TextUser.htmlFor = "AreaUser"; // Lien avec l'ID de l'input utilisateur
  TextUser.innerText = "Email ou Nom d'utilisateur"; // Texte du label

  // Création du champ de saisie pour le mot de passe
  let Mdp = document.createElement("input");
  Mdp.id = "AreaMdp"; // ID champ mdp
  Mdp.type = "password";
  Mdp.required = true; // Champ obligatoire

  // Label champ mdp
  let TextMdp = document.createElement("p");
  TextMdp.htmlFor = "AreaMdp"; // Lien avec l'ID de l'input mot de passe
  TextMdp.innerText = "Mot de passe"; // Texte du label

  // Création du bouton de soumission
  let Submit = document.createElement("input");
  Submit.id = "Send"; // ID pour le bouton de soumission
  Submit.type = "button";
  Submit.value = "Se Connecter";

  // Div pour afficher les messages d'erreur
  let ErrorDiv = document.createElement("div");
  ErrorDiv.id = "ErrorMessage"; // ID pour la div d'erreur
  ErrorDiv.style.color = "#dc3545"; // Couleur rouge pour le texte de l'erreur
  ErrorDiv.style.display = "none"; // Masquer par défaut la div d'erreur

  // Ajout éléments créés au formulaire
  FormConn.appendChild(TextUser); // Ajout label utilisateur
  FormConn.appendChild(Users); // Ajout champ utilisateur
  FormConn.appendChild(TextMdp); // Ajout label mot de passe
  FormConn.appendChild(Mdp); // Ajout champ mot de passe
  FormConn.appendChild(Submit); // Ajout bouton de soumission
  FormConn.appendChild(ErrorDiv); // Ajout div erreur au formulaire
  body.appendChild(FormConn); // Ajout formulaire au body de la page

  // Ajout écouteur d'événement au bouton de soumission
  Submit.addEventListener("click", async function (event) {
      event.preventDefault(); // Empêche comportement par défaut (soumission du formulaire)
      const Username = Users.value; // Récupère valeur champ utilisateur
      const UserMdp = Mdp.value; // Récupère valeur champ mot de passe
      const info = btoa(`${Username}:${UserMdp}`); // Encode les identifiants en base64 authentification

      try {
          // Envoi requête POST à l'API pour la connexion
          const raiponce = await fetch("https://zone01normandie.org/api/auth/signin", {
              method: "POST",
              headers: {
                  Authorization: `Basic ${info}`, // Ajout en-tête d'authentification avec les identifiants
              },
          });

          if (raiponce.ok) { // Si réponse OK (code 200)
              const data = await raiponce.json(); // Récupère réponse sous forme d'objet JSON
              localStorage.setItem("jwt", data.token); // Stocke token JWT dans localStorage
              DrawIntra(data); // Appelle la fonction pour afficher les données après connexion réussie
              ErrorDiv.style.display = "none"; // Masque le message d'erreur
          } else {
              // Si identifiants invalides, affiche message d'erreur
              ErrorDiv.innerText = "le mot de passe ou l'identifiant est invalide"; 
              ErrorDiv.style.display = "block"; // Affiche le message d'erreur
          }
      } catch (error) {
          // Si une erreur réseau survient, affiche un message d'erreur
          ErrorDiv.innerText = "le mot de passe ou l'identifiant est invalide"; 
          ErrorDiv.style.display = "block"; // Affiche le message d'erreur
      }
  });
}
  
function DrawIntra(data) {
  document.body.innerHTML = ""; // Vide le contenu actuel du body
  // Requête GraphQL pour récupérer infos sur utilisateur et ses transactions
  const query = {
    query: `{
        user{
            id
            lastName
            firstName
            auditRatio
            totalUp
            totalDown
        }
            transaction{
                amount
                type
            }
        }`,
  };

  // Requête GraphQL pour récupérer XP utilisateur (non utilisée)
  const query2 = {
    query: `{
         user {
              xps {
                   amount
              }
         }
    }`,
  }; 

  // Requête GraphQL pour récupérer transactions triées par date (non utilisée)
  const query3 = {
    query: `{
         user {
              transactions(order_by: {createdAt: asc}){
                   type
                   amount
              }
         }
    }`,
  }; 

  // Envoi requête POST à l'API GraphQL avec la première requête
  fetch("https://zone01normandie.org/api/graphql-engine/v1/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${data}`, // Utilise token JWT pour s'authentifier
    },
    body: JSON.stringify(query), // Envoie requête sous forme JSON
  })
  .then((response) => response.json()) // Récupère réponse en JSON
  .then((data) => {
      const data2 = data.data.user[0]; // Récupère données utilisateur
      let delog = document.createElement("input"); // Crée bouton pour déconnexion
      delog.id = "delog";
      delog.type = "button";
      delog.value = "Déconnexion"; 
      delog.addEventListener("click", function () {
        location.reload(); // Recharge la page pour simuler la déconnexion
      });
      document.body.appendChild(delog); // Ajoute bouton de déconnexion au body

      // Création et ajout d'un élément pour afficher le nom de l'utilisateur
      let Divpseud = document.createElement("div");
      Divpseud.id = "Name";
      let Name = document.createElement("h1");
      Name.id = "IntraName";
      Name.innerText = "Bienvenue " + data2.firstName + " " + data2.lastName; // Affiche prénom et nom utilisateur
      
      // Création et ajout d'un élément pour afficher le ratio des audits
      let auditratin = document.createElement("div");
      auditratin.id = "ration";
      let ratiotexte = document.createElement("p");
      ratiotexte.id = "Textraction";
      ratiotexte.innerText = "Audits ratio";
      
      let total = document.createElement("h4");
      total.id = "total";
      total.innerText = Math.round(data2.auditRatio * 10) / 10; // Arrondit le ratio des audits
      
      const maxBarHeight = 150; // Hauteur maximale des barres dans le graphique
      const barWidth = 75; // Largeur des barres
      const barSpacing = 65; // Espacement entre les barres

      // Création d'un conteneur SVG pour afficher les barres de totalUp et totalDown
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("width", (barWidth * 2) + barSpacing + 75); // Largeur du SVG
      svg.setAttribute("height", maxBarHeight + 75); // Hauteur du SVG
      
      // Création de la barre représentant totalUp
      const upBarHeight = (data2.totalUp / Math.max(data2.totalUp, data2.totalDown)) * maxBarHeight;
      const upRect = document.createElementNS(svgNS, "rect");
      upRect.setAttribute("x", "7"); 
      upRect.setAttribute("y", maxBarHeight - upBarHeight + 5); // Positionnement de la barre
      upRect.setAttribute("width", barWidth); 
      upRect.setAttribute("height", upBarHeight); // Hauteur de la barre en fonction de totalUp
      upRect.setAttribute("fill", "red"); // Couleur de la barre
      svg.appendChild(upRect);

      // Ajouter un texte au-dessus de la barre totalUp
      const upText = document.createElementNS(svgNS, "text");
      upText.setAttribute("x", "7");
      upText.setAttribute("y", maxBarHeight - upBarHeight); // Positionnement du texte
      upText.setAttribute("font-family", "Arial");
      upText.setAttribute("font-size", "12");
      upText.setAttribute("fill", "#ffffff"); // Couleur du texte
      upText.textContent = `Donné: ${(data2.totalUp * 10e-7).toFixed(2)} MB`; // Affiche la valeur de totalUp convertie en MB
      svg.appendChild(upText);

      // Création de la barre représentant totalDown
      const downBarHeight = (data2.totalDown / Math.max(data2.totalUp, data2.totalDown)) * maxBarHeight;
      const downRect = document.createElementNS(svgNS, "rect");
      downRect.setAttribute("x", barWidth + barSpacing + 10);
      downRect.setAttribute("y", maxBarHeight - downBarHeight + 10); // Positionnement de la barre
      downRect.setAttribute("width", barWidth); 
      downRect.setAttribute("height", downBarHeight); // Hauteur de la barre en fonction de totalDown
      downRect.setAttribute("fill", "lightgreen"); // Couleur de la barre
      svg.appendChild(downRect);

      // Ajouter un texte au-dessus de la barre totalDown
      const downText = document.createElementNS(svgNS, "text");
      downText.setAttribute("x", barWidth + barSpacing + 10);
      downText.setAttribute("y", maxBarHeight - downBarHeight + 7); // Positionnement du texte
      downText.setAttribute("font-family", "Arial");
      downText.setAttribute("font-size", "8");
      downText.setAttribute("fill", "#ffffff"); // Couleur du texte
      downText.textContent = `Reçu: ${(data2.totalDown * 10e-7).toFixed(2)} MB`; // Affiche la valeur de totalDown convertie en MB
      svg.appendChild(downText);

      // Ajout éléments au body du document
      Divpseud.appendChild(Name); // Ajout nom utilisateur
      auditratin.appendChild(ratiotexte); // Ajout texte ratio
      auditratin.appendChild(svg); // Ajout graphique
      auditratin.appendChild(total); // Ajout ratio
      document.body.appendChild(Divpseud); // Ajout du nom au body
      document.body.appendChild(auditratin); // Ajout du ratio et du graphique au body

      // Filtrage des transactions liées aux compétences (types contenant "skill_")
      const alltransaction = data.data.transaction;
      var allskills = [];
      for (let i = 0; i < alltransaction.length; i++) {
        if (alltransaction[i].type.includes("skill_")) {
          allskills.push(alltransaction[i]); // Ajout des transactions de compétences à allskills
        }
      }

      // Organisation des transactions de compétences par type
      let tabEach = [[]];
      allskills.forEach((element) => {
        let found = false; // Indique si un tableau avec le même type a été trouvé
        tabEach.forEach((skill) => {
          if (tabEach[0].length === 0) {
            tabEach[0].push(element); // Si le tableau est vide, on y ajoute l'élément
            found = true;
          } else if (skill[0].type === element.type) {
            skill.push(element); // Si un tableau avec le même type existe, on y ajoute l'élément
            found = true; 
            return;
          }
        });
        if (!found) {
          let newTab = []; // Crée un nouveau tableau pour un nouveau type
          newTab.push(element); 
          tabEach.push(newTab); 
        }
      });

      // Extraction de la valeur maximale pour chaque groupe de compétences
      let tabMax = [];
      for (let i = 0; i < tabEach.length; i++) {
        let max = getMaxValue(tabEach[i]); // Récupère la transaction avec le montant le plus élevé
        tabMax.push(max); // Ajoute cette transaction à tabMax
      }

      // Création d'un conteneur pour les anneaux circulaires représentant les compétences
      const ringsContainer = document.createElement("div");
      ringsContainer.id = "ringsContainer";
      tabMax.forEach((element) => {
        const svgRing = createCircularRingSVG(element.amount, element.type); // Création d'un SVG pour chaque compétence
        const div = document.createElement("div");
        div.innerHTML = svgRing; // Ajout du SVG dans un div
        ringsContainer.appendChild(div); // Ajout de chaque div au conteneur
      });
      document.body.appendChild(ringsContainer); // Ajout du conteneur au body
    });
}

  function getMaxValue(arr) {
    // Utiliser reduce pour trouver l'objet avec la valeur 'amount' maximale
    return arr.reduce((max, obj) => {
      return obj.amount > max.amount ? obj : max;
    });
  }
  function createCircularRingSVG(percentage, type, radius = 105, strokeWidth = 10) {
    // Limite le pourcentage entre 0 et 100
    percentage = Math.min(100, Math.max(0, percentage));
    // Dimensions du cercle
    const diameter = radius * 2;
    const circumference = 2 * Math.PI * (radius - strokeWidth / 2);
    // Calcul de l'offset pour représenter le pourcentage
    const offset = circumference - (percentage / 100) * circumference;
// Création du SVG avec les éléments cercle
const svg = `
    <svg width="${diameter}" height="${diameter}" viewBox="0 0 ${diameter} ${diameter}">
        <!-- Cercle de fond -->
        <circle
            cx="${radius}" cy="${radius}" r="${radius - strokeWidth / 2}"
            fill="none"
            stroke="#e6e6e6"
            stroke-width="${strokeWidth}"
        />
        
        <!-- Cercle de progression -->
        <circle
            cx="${radius}" cy="${radius}" r="${radius - strokeWidth / 2}"
            fill="none"
            stroke="#433cd0"
            stroke-width="${strokeWidth}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${offset}"
            stroke-linecap="round"
            transform="rotate(-90 ${radius} ${radius})"
        />
        
        <!-- Texte au centre -->
        <text
            x="50%" y="50%" text-anchor="middle" dy=".3em"
            font-size="20px" fill="white">
            ${type} ${percentage}%
        </text>
    </svg>
`;

    return svg;
  }
  createlogin();