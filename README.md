Initializing project:
1. Make sure your Neo4j database is on.
2. Enter "backend" directory and type "yarn start".
3. In new terminal enter "frontend" directory and type "yarn start".

If you want to use admin mode you should add appropriate node to your Neo4j database with labels: "User" and "AdminUser" and following properties: 

{
    isAdmin: true,
    login: admin,
    password: adminpassword
}

To use admin-reserved features you should log in with the following:

login: admin
password: adminpassword