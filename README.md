# Projet s'inspirant de League of Legends appliquant les principes Devops
## Nicolas Brazzolotto

### IMPORTANT
Ce repository n'est pas l'originale, il ne possède donc pas l'ensemble des branches/commits qui ont été créés pour mettre en place le devops/gitflow.  
Ce lien: https://github.com/Sharcan/devops-a4-league amène directement au repository orginal.

### Explication
Ce projet a pour principe de recréer la selection des champions lors d'un lancement de partie sur League Of Legends.
Ce projet est totalement fonctionnel, pour le tester il suffit d'ouvrir 2 onglets, sur chaque onglet s'inscrire et la partie commencera automatiquement.

Ce projet applique les principes du Devops, il possède donc : 
* Un déploiement continue en [**Intégration**](https://dashboard.heroku.com/apps/devops-a4-league-preprod)  
https://dashboard.heroku.com/apps/devops-a4-league-preprod
* Un déploiement continue en [**Production**](https://devops-a4-league.herokuapp.com/)  
https://devops-a4-league.herokuapp.com/

Pour chaque déploiement, plusieurs *stages* sont effectués:
* Dans un premier temps, on build l'application avec `npm build`.
* Dans un second temps, on check si le code de l'application respecte le bon format grâce à `Eslint`.
* Dans un troisième temps, on lance les différents tests unitaires et/ou d'intégration que l'on a dans l'application avec `npm test`.
* Dans un quatrième temps, on check si l'application possède des failles de sécurité.
* Enfin on déploie l'application sur `Heroku` (en intégration ou en production en fonction de la branche).