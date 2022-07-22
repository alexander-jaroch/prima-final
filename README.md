# Chess Simulator
| Key         | Value                               |
| ----------- | ----------------------------------- |
| Autor       | Alexander Jaroch                    |
| Semester    | Sommersemester 2022                 |
| Studiengang | Medieninformatik B.Sc., 8. Semester |
| Kurs        | PRIMA                               |
| Dozent      | Prof. Dr. Jirka Dell'Oro-Friedl     |

## Links
[GitHub Page](https://alexander-jaroch.github.io/prima-final/index.html)
[Design Document]()

## Wie funktioniert's?
- Linke Maustaste drücken: Figur greifen
- Linke Maustaste gedrückt, Maus bewegen: Figur bewegen
- Linke Maustaste loslassen: Figur loslassen

Kann alleine oder zu zweit gespielt werden.

## Kriterienkatalog
| Nr | Kriterium           | Erklärung                                                                                                           |
| -- | ------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 1 | Units and Positions | Das Schachbrett liegt im Weltkoordinatensystem so, dass die Physik richtig wirken kann. Es liegt auf der x-z-Ebene und die Figuren stehen senkrecht dazu, also parallel zur Weltkoordinatenachse y. Die simulierte Schwerkraft wirt entgegten der y-Achse. Die lokalen Koordinaten der Figuren und des Bretts slebst stimmen mit richtungsmäßig weitesgehend mit den Weltkoordinaten überein. |
| 2 | Hierarchy | Es gibt beim Schach-Simulator eine Gesamtszene mit dem Spielbrett, einen Graphen für das GrabTool, mit welchem die Figuren bewegt werden können, und jeweils einen Graphen für jeden Figurentyp (Bauer, Turm, Springer, Läufer, Dame, König). Die Hauptszene beinhaltet nur das Brett und das GrabTool. Die Figuren werden beim Initialisieren der GameLogic auf dem Brett platziert. Durch eine gute Hierchie, können zusammengehörende Elemente zusammen bleiben und z.B. problemlos angepasst oder wiederverwendet werden. |
| 3 | Editor | Wie oben schon erwähnt werden die Figuren durch eine Funktion im Code auf dem Spielbrett platziert. So können, neben Reduzierung von Fleißarbeit durch manuelles Platzieren, zudem die Figuren mit Zusatzfunktionen ausstatten werden. Da die Initialisierung in eine eigene Funktion ausgelagert ist, können diese jederzeit beliebig oft neu aufgestellt werden. |
| 4 | Scriptcomponents | Eine Skriptkomponente wird für die Steuerung des Aufhebemechanismus verwendet. In ihr kann der gesamte Code für diese Funktion ausgelagert werden, wodurch die Gameloop sauberer bleibt. Außerdem kann die Skriptkomponente theoretisch wiederverwendet werden. Z.B. für einen zweiten Greifer (GrabTool), welcher dann unabhängig vom ersten auch Objekte greifen und loslassen kann (Greifen = Anhängen von Objekt an die Greiferkomponente, welche wiederum mit der Maus bewegt wird, mehr dazu in B). |
| 5 | Extend | Wie schon in 3 angedeutet, kann von FudgeCore-Klassen geerbt werden. Die Klasse für die Schachfiguren erbt hier von der Node-Klasse von FudgeCore. Dadurch, können die Figuren, wie ganz normale Nodes gehandhabt werden und trotzdem erweirte Logik haben. So könnten die Figuren z.B. jeweils ihre möglichen Züge speichern und dadurch eine Validierung des Zuges erfolgen. |
| 6 | Sound | Es werden drei Sounds verwendet. Das sind drei Varianten von Aufprallgeräuschen, zufällig bei der Kollision mit dem Brett oder einer anderen Spielfigur abgespielt werden. Dabei richtet sich die Lautstärke an die Stärke des bei der Kollision entsehenden Impulses. Die Logik dazu befindet sich in der Klasse der Schachfigur, welche von Node erbt. |
| 7 | VUI | Es gibt ein simples VUI, welches unveränderlich die Zeit und die aktuell spielende Seite anzeigt. Diese Werte werden mithilfe von FudgeUserInterface und Mutables aktualisiert. Desweiteren wurde das VUI um interaktive Komponenten, wie der Möglichkeit zum Wechseln der spielenden Seite, zur Einstellung der Farben der Spielfiguren beider Seiten sowie einem Reset-Button erweitert |
| 8 | Event-System | Das Event-System wird an mehreren Stellen verwendet. Zum einen werden mithilfe von Kollisions-Events die Sounds für den Aufprall abgespielt. Desweiteren werden Pointer-Events für das Greifen (pointer down, pointer up) und Bewegen (pointer move) der Figuren werwendet. Außerdem werden allgemeine Events wie das Anfügen einer Komponente in Skriptkomonenten verwendet und vorausgesetzt. | 
| 9 | External Data | Mit einer Konfigurationsdatei werden die verschiedenen Resourcen, welche im Code verwendet werden, verwaltet. Mit der JSON-Datei sollte der Verwendung verschiedener Resourcen-IDs im Code entgegengewirkt werden. In der Datei werden einfache Schlüssel auf die unnhandlichen Resourcen-Ids gemappt, wodurch deren Handhabung stark erleichtert wird. Auf diese Weise wurden im Verlauf des Projekts schon mehrermals Resourcen schnell und einfach durch andere Resourcen ausgetauscht. |
| A | Light | Es werden zwei Lichtquellen verwendet: Ein Point-Light (vgl. Sonne: stark, "wirft Schatten") und ein Ambient-Light (vgl. Himmel: diffus, erhellt Umgebung). Durch die Verwendung dieser beiden Quellen sollten natürlich wirkende Lichtverhältnisse geschaffen werden. |
| B | Physics | Jede Figur, und das Spielbrett haben einen Rigidbody, wodurch sie miteinander kollidieren und interagieren können. Zunächst sollten Joints für das Greifen der Figuren verwendet werden. Allerdings hat das mit dem Bewegen des Joints nicht ideal funktioniert. Die Figur bleibt nicht am Joint und schleift am Brett entlang. Das Auswählen der zu greifenden Figur sowie das Bewegen der gegriffenen Figur findet über Raycasts statt. Ein Strahl wird ausgehend vom Mauszeiger mit der Richtung der Kamera ausgesendet und "kollidiert" mit einer Figur. Diese Figur kann dann "gegriffen" werden. Ein weiterer Raycast kollidiert beim Bewegen der Maus (pointer move event) mit dem Spielbrett, wodurch die neue Position für die gegriffene Figur bestimmt wird. Beim Loslassen der Figur, wird die letzte Geschwindigkeit genommen, um eine Kraft auf die Figur zu wirken, wodurch sie "geworfen" werden kann. |
| C | Net | nicht verwendet |
| D | State Machines | nicht verwendet |
| E | Animation | Das Greifen wird mithilfe der Animationskomponente animiert. Die Figur wird angehoben, damit sie nicht am Brett entlang schleift und ggf. wenn umgekippt und verschoben in die Ursprungsposition (lokal 0) zurückgebracht. Dazu wird für den Start der Animation der aktuelle Zustand der Transformationskomponente genommen und für das Ende der Animation die lokale Verschiebung und Drehung auf 0. Die Animationsklasse aus diesen "Keyframes" eine Animation, welche über das Anhängen der Animationskomponente abgespielt werden kann. Diese wird beim Greifen angehängt und somit abgespielt (einmalig = PLAYONCE). Für den Hintergrung wurde ein Animierer "Sternenhimmel" (eher Boden) mithilfe von Sprites erzeugt. Dieser ist zufällig und somit bei jedem Laden anders. |
