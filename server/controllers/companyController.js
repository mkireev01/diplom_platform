const { Company } = require("../models/models");

class CompanyController {

  async create(req, res) {

    const userId = req.user.id;
  

        const payload = {
          ...req.body,
          userId,
        };
  
    try {
      const company = await Company.create(payload);
      return res.status(201).json(company);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }


  async getAll(req, res) {
    try {
      const list = await Company.findAll();
      return res.json(list);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  
  async getOne(req, res) {
    try {
      const { id } = req.params;
      const item = await Company.findByPk(id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      return res.json(item);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

 
  async update(req, res) {
    try {
      const { id } = req.params;
      const [updated] = await Company.update(req.body, { where: { id } });
      if (!updated) return res.status(404).json({ error: 'Not found' });
      const updatedRecord = await this.Model.findByPk(id);
      return res.json(updatedRecord);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }


  async delete(req, res) {
    try {
      const { id } = req.params;
      const destroyed = await Company.destroy({ where: { id } });
      if (!destroyed) return res.status(404).json({ error: 'Not found' });
      return res.json({ message: 'Deleted' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new CompanyController();
