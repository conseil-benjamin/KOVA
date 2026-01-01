Choses à faire :

## Réfléchir à des idées de jokers à implémenter durant la partie. 

In game : 

- Réussir à récupérer une nouvelle question à chaque fois que le timer expire
- gérer le timer, le timer est stocké dans redis et on le met à jour toutes les 5 secondes
- Quand quelqu'un répond, on vérifie si c'est la bonne réponse
- Si c'est la bonne réponse, on met à jour le score de l'utilisateur
- Si c'est la mauvaise réponse, on ne fait rien et la question en cours continue
- Si tout le monde à répondu bon, on passe à la question suivante même si le timer n'a pas expiré
- Créer une méthode coté serveur lorsque l'on demande une nouvelle question on doit vérifier si un joueur a gagné et si oui on termine la partie.


Après la partie : 

- Créer une méthode qui va permettre de récupérer les scores de la partie
- Afficher les scores de la partie avec un classement des trois premiers
- Créer une méthode relancer la partie qui va simplement réinitialiser les scores et les questions. Et faire en sorte que le créateur puisse modifier les paramètres de la partie. 


Page profil utilisateur : 

- Créer une méthode qui va permettre de récupérer les parties jouées par l'utilisateur
- Afficher des graphiques avec des statistiques sur les parties jouées par l'utilisateur
- Nombres de parties jouées
- Nombres de parties gagnées