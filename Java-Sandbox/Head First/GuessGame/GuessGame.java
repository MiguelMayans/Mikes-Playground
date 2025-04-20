public class GuessGame {
  Player p1;
  Player p2;
  Player p3;

  public void startGame() {
    p1 = new Player();
    p2 = new Player();
    p3 = new Player();

    int guessp1 = 0;
    int guessp2 = 0;
    int guessp3 = 0;

    boolean p1isRight = false;
    boolean p2isRight = false;
    boolean p3isRight = false;

    int targetNumber = (int) (Math.random() * 100);
    System.out.println("Estoy pensando en un número entre 0 y 99...");

    while (true) {
      System.out.println(
          "\nEl número a adivinar es: " + targetNumber); // (puedes ocultarlo si quieres)

      p1.guess();
      p2.guess();
      p3.guess();

      guessp1 = p1.number;
      guessp2 = p2.number;
      guessp3 = p3.number;

      if (guessp1 == targetNumber) {
        p1isRight = true;
      }

      if (guessp2 == targetNumber) {
        p2isRight = true;
      }

      if (guessp3 == targetNumber) {
        p3isRight = true;
      }

      if (p1isRight || p2isRight || p3isRight) {
        System.out.println("\n¡Tenemos un ganador!");
        System.out.println("¿El jugador 1 adivinó? " + p1isRight);
        System.out.println("¿El jugador 2 adivinó? " + p2isRight);
        System.out.println("¿El jugador 3 adivinó? " + p3isRight);
        System.out.println("¡Fin del juego!");
        break;
      } else {
        System.out.println("Nadie adivinó. ¡Intenta otra vez!\n");
      }
    }
  }
}
