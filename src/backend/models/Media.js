/**
 * Modelo de Mídia
 * Representa uma mídia (imagem ou vídeo) a ser exibida na TV
 */

class Media {
  /**
   * Cria uma nova instância de Mídia
   * @param {string} type - Tipo de mídia (image, video)
   * @param {string} url - URL da mídia
   * @param {string} caption - Legenda da mídia
   * @param {string} createdBy - ID do cliente que enviou a mídia
   */
  constructor(type, url, caption = '', createdBy = null) {
    this.id = this._generateId();
    this.type = type;
    this.url = url;
    this.caption = caption;
    this.createdBy = createdBy;
    this.createdAt = new Date();
  }

  /**
   * Gera um ID único para a mídia
   * @returns {string} ID único
   * @private
   */
  _generateId() {
    return `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Verifica se a mídia é uma imagem
   * @returns {boolean} Verdadeiro se for imagem
   */
  isImage() {
    return this.type === 'image';
  }

  /**
   * Verifica se a mídia é um vídeo
   * @returns {boolean} Verdadeiro se for vídeo
   */
  isVideo() {
    return this.type === 'video';
  }

  /**
   * Atualiza a legenda da mídia
   * @param {string} caption - Nova legenda
   */
  updateCaption(caption) {
    this.caption = caption;
  }

  /**
   * Converte a mídia para um objeto JSON
   * @returns {object} Representação JSON da mídia
   */
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      url: this.url,
      caption: this.caption,
      createdBy: this.createdBy,
      createdAt: this.createdAt
    };
  }
}

module.exports = Media;