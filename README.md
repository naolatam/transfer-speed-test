# Transfer-Speed-Test

Ce projet avait simplement pour but de voir qu'elle méthode était la plus rapide pour faire transiter des données.
Voici les deux méthodes essayés:

## 1: Via Websocket
Le parent crée deux enfants, un qui execute un websocket, et un deuxième qui se connecte au websocket. Le but est de voir à quel vitesse les deux threads peuvent communiquer.
Des données aléatoires sont donc générés pour simuler un véritable échange.
Résultat: La latence augmente exponentiellement vis à vis de la quantité de données.
```
Latency with websocket: 8.907639287765653ms | number: 8705 | Bytes : 622.84 MiB
```

## 1: Via le parent
Le parent crée deux enfants, un qui va recevoir des données, et un qui va les envoyés. 
Le but, est qu'un des deux enfants fasse du scraping à haute intensité, et que le deuxième partage les données récupéré à plusieurs autres programmes via un websocket. 

Des données aléatoires sont donc générés pour simuler un véritable échange.
Résultat: La latence augmente pratiquement pas avec la quantité de données.
```
Latency with parent: 0.09211869028977603ms | number: 454696 | Bytes : 31.92 GiB
```

### Explication des résultats:
La latence est le délai entre l'envoie et la récéption des données. 
Le nombre (`number`) est la quantité d'échange réalisé
Et le `Byte` est la quantité de données qui a transité à travers ces échanges

## Conclusion
Pour faire transiter des données rapidement entre plusieurs enfants en javascript, il est beaucoup plus rapide de passer par le parent.
Il reste néanmoins plus simple pour une communication unilatéral (pas de réponse du receveur) au niveau de la mise en place, d'utiliser un websocket.
