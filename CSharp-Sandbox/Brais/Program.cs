using System;

class Program
{
    static void Main(string[] args)
    {
        // Esto es un comentario
        Console.WriteLine("Hello, World!");
        string myString = "Esto es un string";
        myString = myString + " y esto es otro string";

        int myInt = 5;

        Console.WriteLine(myString);

        // tengo que poner una f al final para que sea un float
        float myFloat = 5.5f;

        // para un double no hace falta poner nada
        //un double es un float pero con más precisión
        double myDouble = 5.7;

        // un dynamic es un tipo de dato que puede cambiar de tipo (no es recomendable usarlo)
        dynamic myDynamic = 5;
        myDynamic = "hola";

        // un var es un tipo de dato inferido por el compilador
        var myVar = 5;
        // myVar = "hola"; // no se puede hacer esto porque myVar es un int 

        bool myBool = true;

        // simbolo de dollar para interpolar variables
        Console.WriteLine(myInt + 5 + myFloat + myDouble + $"{myBool}" + myVar);

        // las constantes empiezan con mayúscula y hay que tiparlas
        const string MyConst = "Esto es una constante";

        Console.WriteLine(MyConst);

        // Estrucutras
        // hay que poner el new para inicializar la estructura
        // se definen con una longitud fija
        var myArray = new int[5, 6, 17];
        var myArray2 = new string[] { "hola", "adios", "qué tal" };

        var myDictionary = new Dictionary<string, string>{
            {"hola", "adios"},
            {"qué tal", "bien"},
            {"hasta luego", "hasta mañana"}
        };

        // el HashSet es una colección de elementos únicos, si se repite un elemento no lo añade, y no tiene un orden
       
        var mySet = new HashSet<string>{
        "uno",
        "dos",
        "tres"
        };

        // Bucles

        for (int i = 0; i < 10; i++) {
            Console.WriteLine(i);
        }

        foreach (var item in myArray2) {
            Console.WriteLine(item);
        }

        // Flujos

        if (myInt == 5) {
            Console.WriteLine("Es 5");
        } else if (myInt == 6) {
            Console.WriteLine("Es 6");
        } else {
            Console.WriteLine("No es 5 ni 6");
        }

        MyFunction();
        // Funciones

        static void MyFunction() {
            Console.WriteLine("Función ejecutada");
        }

        static int Sum(int a, int b) {
            return a + b;
        }

       Console.WriteLine(Sum(5, 6));

        Persona Miguel = new Persona
        {
            Nombre = "Miguel",
            Edad = 25
        };
        Miguel.Saludar();

    }

}

class Persona
{
    public required string Nombre { get; set; }
    public int Edad { get; set; }

    public void Saludar() {
        Console.WriteLine($"Hola, mi nombre es {Nombre} y tengo {Edad} años.");
    }
}

