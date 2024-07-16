import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
const port = 3001;

// для запуску сервера команда: cd src npx ts-node-esm -P ../tsconfig.node.json server.ts

const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataFilePath = path.join(__dirname, "data.json");

// Функция для чтения файла с данными
function readDataFile() {
  if (fs.existsSync(dataFilePath)) {
    const fileContent = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileContent);
  }
  return [];
}

// Обработчик GET запроса для загрузки всех продуктов
app.get("/products", (req: Request, res: Response) => {
  const data = readDataFile();
  res.status(200).json(data);
});

// Обработчик GET запроса для загрузки конкретного продукта по его id
app.get("/products/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const data = readDataFile();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const product = data.find((product: any) => product.id === id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ success: false, message: "Product not found" });
  }
});

// Обработчик POST запроса для создания нового продукта
app.post("/product-create", (req: Request, res: Response) => {
  const { name, price, description } = req.body;

  const isValid =
    typeof name === "string" &&
    typeof price === "number" &&
    typeof description === "string";

  if (isValid) {
    const data = readDataFile();
    const id = Date.now().toString();
    const newProduct = { id, name, price, description };
    data.push(newProduct);
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    res.status(200).json(newProduct);
  } else {
    res.status(400).json({ success: false, message: "Invalid product data" });
  }
});

// Обработчик PUT запроса для обновления продукта по его id
app.put("/product-update/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, description } = req.body;

  const data = readDataFile();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productIndex = data.findIndex((product: any) => product.id === id);

  if (productIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  data[productIndex] = { ...data[productIndex], name, price, description };
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  res.status(200).json(data[productIndex]);
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
