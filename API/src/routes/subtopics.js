const { Router } = require("express");
const Subtopic = require("../models/Subtopic");
const Topic = require("../models/Topic");
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const router = Router();

router.get("/", async (req, res) => {
    if (req.query.hasOwnProperty("topic")) {
        const subtopicSize = await Subtopic.count({
            where: {
                topic_id: req.query.topic
            }
        });
        
        if (subtopicSize > 0) {
            const subtopicList = await Subtopic.findAll({
                include: [{
                    model: Topic,
                    required: true
                }]
            });

            console.log(subtopicList);

            let subtopics = [];
            subtopicList.forEach((subtopic) => {
                subtopics.push({
                    id: subtopic.id,
                    topic: {
                        id: subtopic.topic_id,
                        description: ""
                    },
                    label: subtopic.label,
                    criadoEm: subtopic.created_at,
                    criadoPor: subtopic.created_by,
                    excluido: subtopic.removed,
                    excluidoEm: subtopic.removed_at,
                    excluidoPor: subtopic.removed_by,
                    ultimaAtualizacao: subtopic.updatedAt
                });
            });

            res.json(subtopics);
        } else {
            res.status(404).json({ message: "Não existem subtópicos para retorno." });
        }
    } else {
        const subtopicSize = await Subtopic.count();

        if (subtopicSize > 0) {
            const subtopicList = await Subtopic.findAll();

            let subtopics = [];
            subtopicList.forEach((subtopic) => {
                subtopics.push({
                    id: subtopic.id,
                    topic: {
                        id: subtopic.topic_id,
                        description: ""
                    },
                    label: subtopic.label,
                    criadoEm: subtopic.created_at,
                    criadoPor: subtopic.created_by,
                    excluido: subtopic.removed,
                    excluidoEm: subtopic.removed_at,
                    excluidoPor: subtopic.removed_by,
                    ultimaAtualizacao: subtopic.updatedAt
                });
            });

            res.json(subtopics);
        } else {
            res.status(404).json({ message: "Não existem subtópicos para retorno." });
        }
    }
});

module.exports = router;