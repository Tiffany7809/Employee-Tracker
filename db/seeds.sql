INSERT INTO department(name)
VALUES("Engineering"), ("Sales"), ("Finance"), ("Legal"), ("Marketing"), ("Administration");

INSERT INTO role(title, salary, department_id)
VALUES("Engineer", 11000, 1), ("Sale Associate", 85000, 2), ("CFO", 230000, 3),("Financial Advisor", 400000, 3),("Marketing", 160000, 5),("Administrator",140000, 6);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Cal","El",6, 4), ("Wade","Wilson",4,4), ("Selena","Kyle",2,5), ("Bruce","Wayne",3,NULL), ("Peter","Parker",5,NULL);
