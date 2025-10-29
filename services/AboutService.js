class AboutService {
  constructor(pool) {
    this.pool = pool;
  }

  // Get all about content sections
  async getAboutContent() {
    try {
      const [content] = await this.pool.execute(`
        SELECT * FROM about_content 
        WHERE is_active = 1 
        ORDER BY order_index
      `);
      
      const [team] = await this.pool.execute(`
        SELECT * FROM about_team 
        WHERE is_active = 1 
        ORDER BY order_index
      `);
      
      const [stats] = await this.pool.execute(`
        SELECT * FROM about_stats 
        WHERE is_active = 1 
        ORDER BY order_index
      `);

      const [values] = await this.pool.execute(`
        SELECT * FROM about_values 
        WHERE is_active = 1 
        ORDER BY order_index
      `);

      return {
        content: content,
        team: team,
        stats: stats,
        values: values
      };
    } catch (error) {
      console.error('Database error:', error);
      return { content: [], team: [], stats: [], values: [] };
    }
  }

  // Get content by section key
  async getContentByKey(sectionKey) {
    try {
      const [rows] = await this.pool.execute(
        'SELECT * FROM about_content WHERE section_key = ? AND is_active = 1',
        [sectionKey]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  }

  // Update content section
  async updateContent(id, data) {
    try {
      const { section_title, content, image_url, order_index } = data;
      
      const [result] = await this.pool.execute(`
        UPDATE about_content 
        SET section_title = ?, content = ?, image_url = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [section_title, content, image_url || null, order_index || 0, id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  // Add new content section
  async addContent(data) {
    try {
      const { section_key, section_title, content, image_url, order_index } = data;
      
      const [result] = await this.pool.execute(`
        INSERT INTO about_content (section_key, section_title, content, image_url, order_index)
        VALUES (?, ?, ?, ?, ?)
      `, [section_key, section_title, content, image_url || null, order_index || 0]);
      
      return result.insertId;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  // Delete content section
  async deleteContent(id) {
    try {
      const [result] = await this.pool.execute(
        'UPDATE about_content SET is_active = 0 WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  // Team management methods
  async getAllTeamMembers() {
    try {
      const [rows] = await this.pool.execute(`
        SELECT * FROM about_team 
        WHERE is_active = 1 
        ORDER BY order_index
      `);
      return rows;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  }

  async updateTeamMember(id, data) {
    try {
      const { name, position, bio, image, image_url, order_index } = data;
      
      // Use uploaded image path if available, otherwise use image_url
      const finalImageUrl = image || image_url || null;
      
      const [result] = await this.pool.execute(`
        UPDATE about_team 
        SET name = ?, position = ?, bio = ?, image_url = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [name, position, bio, finalImageUrl, order_index || 0, id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async addTeamMember(data) {
    try {
      const { name, position, bio, image, image_url, order_index } = data;
      
      // Use uploaded image path if available, otherwise use image_url
      const finalImageUrl = image || image_url || null;
      
      const [result] = await this.pool.execute(`
        INSERT INTO about_team (name, position, bio, image_url, order_index)
        VALUES (?, ?, ?, ?, ?)
      `, [name, position, bio, finalImageUrl, order_index || 0]);
      
      return result.insertId;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async deleteTeamMember(id) {
    try {
      const [result] = await this.pool.execute(
        'UPDATE about_team SET is_active = 0 WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  // Statistics management methods
  async getAllStats() {
    try {
      const [rows] = await this.pool.execute(`
        SELECT * FROM about_stats 
        WHERE is_active = 1 
        ORDER BY order_index
      `);
      return rows;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  }

  async updateStat(id, data) {
    try {
      const { stat_value, stat_label, order_index } = data;
      
      const [result] = await this.pool.execute(`
        UPDATE about_stats 
        SET stat_value = ?, stat_label = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [stat_value, stat_label, order_index || 0, id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async addStat(data) {
    try {
      const { stat_key, stat_value, stat_label, order_index } = data;
      
      const [result] = await this.pool.execute(`
        INSERT INTO about_stats (stat_key, stat_value, stat_label, order_index)
        VALUES (?, ?, ?, ?)
      `, [stat_key, stat_value, stat_label, order_index || 0]);
      
      return result.insertId;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async deleteStat(id) {
    try {
      const [result] = await this.pool.execute(
        'UPDATE about_stats SET is_active = 0 WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  // Values management methods
  async getAllValues() {
    try {
      const [rows] = await this.pool.execute(`
        SELECT * FROM about_values 
        WHERE is_active = 1 
        ORDER BY order_index
      `);
      return rows;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  }

  async updateValue(id, data) {
    try {
      const { title, description, icon, order_index } = data;
      
      const [result] = await this.pool.execute(`
        UPDATE about_values 
        SET title = ?, description = ?, icon = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [title, description, icon || null, order_index || 0, id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async addValue(data) {
    try {
      const { title, description, icon, order_index } = data;
      
      const [result] = await this.pool.execute(`
        INSERT INTO about_values (title, description, icon, order_index)
        VALUES (?, ?, ?, ?)
      `, [title, description, icon || null, order_index || 0]);
      
      return result.insertId;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async deleteValue(id) {
    try {
      const [result] = await this.pool.execute(
        'UPDATE about_values SET is_active = 0 WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }
}

module.exports = AboutService;
