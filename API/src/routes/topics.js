const { Router } = require("express");
const Topic = require("../models/Topic");
const User = require("../models/User");
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const router = Router();

router.get("/", async (req, res) => {
    const topicsSize = await Topic.count();

    if (topicsSize > 0) {
        const topics = await Topic.findAll();

        let topicReturn = [];

        topics.forEach((topic) => {
            topicReturn.push({
                id: topic.id,
                label: topic.label,
                criadoEm: topic.created_at,
                criadoPor: topic.created_by,
                excluido: topic.removed,
                excluidoEm: topic.removed_at,
                excluidoPor: topic.removed_by,
                ultimaAtualizacao: topic.updated_at
            });
        });

        res.json(topicReturn);
    } else {
        res.status(404).json({ message: "Não existem tópicos para exibir." });
    }
});

router.delete("/:id", async (req, res) => {
    let paramId = req.params.id;

    const topicsCount = await Topic.count({
        where: {
            id: paramId
        }
    });

    if (topicsCount > 0) {
        const topics = await Topic.destroy({
            where: {
                id: paramId
            }
        });

        res.json({ message: "Tópico excluido com sucesso" });
    } else {
        res.status(404).json({ message: "ID do tópico não encontrado para remoção." });
    }
});

router.delete("/", (req, res) => {
    res.status(404).json({ message: "Você não enviou um ID de tópico para remoção." });
});

router.post("/", async (req, res) => {
    let bodyLabel = req.body.label || "";

    if (bodyLabel != "") {
        let token = req.headers.authorization.replace("Bearer", "").replace(" ", "");
        let infos = jwt.decode(token);

        //Recovering user because of the id.
        const user = await User.findOne({
            mail: infos.mail
        });

        let topic = {
            id: uuidv4(),
            label: bodyLabel,
            created_at: new Date(),
            created_by: user.id || "",
            removed: 0,
            updated_at: new Date()
        }

        const newTopic = await Topic.create(topic);

        res.json({message: "Tópico criado com sucesso."});
    } else {
        res.status(404).json({message: "Você não preencheu nenhum valor para Label."});
    }
});

router.patch("/:id", async (req, res) => {
    let paramId = req.params.id;
    let body = req.body || "";

    if (body != "") {
        const topicExist = await Topic.count({
            id: paramId
        });

        if (topicExist > 0) {
            const newTopic = await Topic.update(
                { 
                    label: body.label,
                    updated_at: new Date()
                }, {
                    where: {
                        id: paramId
                    }
                });

            res.json({message: "Tópico atualizado com sucesso."});
        } else {
            res.status(404).json({message: "Você não preencheu um ID válido para atualizar o tópico."}); 
        }
    } else {
        res.status(404).json({message: "Você não preencheu nenhum valor para Label."});
    }
});

router.patch("/", (req, res) => {
    res.status(404).json({ message: "Você não enviou um ID de tópico para atualização." });
});

module.exports = router;