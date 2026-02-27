#include <iostream>

int main() {
    int numero_secreto = 42;
    int intento;

    std::cout << "Adivina el número: ";
    std::cin >> intento;

    if (intento == numero_secreto) {
        std::cout << "¡Has acertado!" << std::endl;
    } else {
        std::cout << "Has fallado. Era el " << numero_secreto << std::endl;
    }

    return 0;
}
