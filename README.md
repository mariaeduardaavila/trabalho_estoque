# trabalho_estoque

#tecnologias utilizadas
*Node.js
*Express
*Sqlite
*jwt

#usuario padrão
usuario:admin
senha:123456
perfil:admin

#Para rodar o projeto
*instalar dependencias
npm install

*criar banco de dados
node src/db/initDb.js

Testando no linux
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{"usuario":"admin","senha":"123456"}'

*Deve retornar o token

#Construir imagem
docker build -t estoque .

#Executar o container
docker run -p 3000:3000 estoque 

Aplicação disponivel em:
http://localhost:3000
