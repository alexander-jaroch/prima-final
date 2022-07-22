# Chess Simulator
|          |                                  |
| -------- | -------------------------------- |
| Author   | Alexander Jaroch                 |
|          | Sommersemester 2022              |
|          | Medieninformatik B.Sc.           |
| Semester | 8                                |
|          | PRIMA                            |
| Docent   | Prof. Dr. Jirka Dell'Oro-Friedl  |

## Links
https://alexander-jaroch.github.io/prima-final/index.html

Link to the finished and executable application on Github-Pages
Link to the design document

## How to Interact
Text

## Catalogue of Criteria
| Nr | Criterion           | Explanation                                                                                                         |
| -- | ------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 1 | Units and Positions | Das Schachbrett liegt im Weltkoordinatensystem so, dass die Physik richtig wirken kann. Es liegt auf der x-z-Ebene und die Figuren stehen senkrecht dazu, also parallel zur Weltkoordinatenachse y. Die simulierte Schwerkraft wirt entgegten der y-Achse. Die lokalen Koordinaten der Figuren und des Bretts slebst stimmen mit richtungsmäßig weitesgehend mit den Weltkoordinaten überein. |
| 2 | Hierarchy | Es gibt beim Schach-Simulator eine Gesamtszene mit dem Spielbrett, einen Graphen für das GrabTool, mit welchem die Figuren bewegt werden können, und jeweils einen Graphen für jeden Figurentyp (Bauer, Turm, Springer, Läufer, Dame, König). Die Hauptszene beinhaltet nur das Brett und das GrabTool. Die Figuren werden beim Initialisieren der GameLogic auf dem Brett platziert. Durch eine gute Hierchie, können zusammengehörende Elemente zusammen bleiben und z.B. problemlos angepasst oder wiederverwendet werden. |
| 3 | Editor | Wie oben schon erwähnt werden die Figuren durch eine Funktion im Code auf dem Spielbrett platziert. So können, neben Reduzierung von Fleißarbeit durch manuelles Platzieren, zudem die Figuren mit Zusatzfunktionen ausstatten werden. Da die Initialisierung in eine eigene Funktion ausgelagert ist, können diese jederzeit beliebig oft neu aufgestellt werden. |
| 4 | Scriptcomponents | Eine Skriptkomponente wird für die Steuerung des Aufhebemechanismus verwendet. In ihr kann der gesamte Code für diese Funktion ausgelagert werden, wodurch die Gameloop sauberer bleibt. Außerdem kann die Skriptkomponente theoretisch wiederverwendet werden. Z.B. für einen zweiten Greifer (GrabTool), welcher dann unabhängig vom ersten auch Objekte greifen und loslassen kann (Greifen = Anhängen von Objekt an die Greiferkomponente, welche wiederum mit der Maus bewegt wird, mehr dazu in B). |
| 5 | Extend | Wie schon in 3 angedeutet, kann von FudgeCore-Klassen geerbt werden. Die Klasse für die Schachfiguren erbt hier von der Node-Klasse von FudgeCore. Dadurch, können die Figuren, wie ganz normale Nodes gehandhabt werden und trotzdem erweirte Logik haben. So könnten die Figuren z.B. jeweils ihre möglichen Züge speichern und dadurch eine Validierung des Zuges erfolgen. |
| 6 | Sound | Es werden drei Sounds verwendet. Das sind drei Varianten von Aufprallgeräuschen, zufällig bei der Kollision mit dem Brett oder einer anderen Spielfigur abgespielt werden. Dabei richtet sich die Lautstärke an die Stärke des bei der Kollision entsehenden Impulses. Die Logik dazu befindet sich in der Klasse der Schachfigur, welche von Node erbt. |
| 7 | VUI | Es gibt ein simples VUI, welches unveränderlich die Zeit und die aktuell spielende Seite anzeigt. Diese Werte werden mithilfe von FudgeUserInterface und Mutables aktualisiert. Desweiteren wurde das VUI um interaktive Komponenten, wie der Möglichkeit zum Wechseln der spielenden Seite, zur Einstellung der Farben der Spielfiguren beider Seiten sowie einem Reset-Button erweitert |
| 8 | Event-System | Das Event-System wird an mehreren Stellen verwendet. Zum einen werden mithilfe von Kollisions-Events die Sounds für den Aufprall abgespielt. Desweiteren werden Maus-Events für das Greifen und Bewegen der Figuren werwendet. | 
| 9  | External Data       | Create a configuration file your application loads and adjusts to the content. Explain your choice of parameters.   |
| A  | Light               | Explain your choice of lights in your graphs (1)                                                                    |
| B  | Physics 	           | Add rigidbody components and work with collisions (1) and/or forces and torques (1) and/or joints (1)               |
| C  | Net 	               | Add multiplayer functionality via network (3)                                                                       |
| D  | State Machines      | Create autonomous entities using the StateMachine (1) and/or ComponentStateMachine (1) defined in FudgeAid          |
| E  | Animation 	         | Animate using the animation system of FudgeCore (1) and/or Sprites (1) as defined in FudgeAid                       |
