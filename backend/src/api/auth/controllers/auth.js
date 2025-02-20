module.exports = {
    async register(ctx) {
      const { email, password, username, telefone, cargo } = ctx.request.body;
  
      // verifica se os campos foram preenchidos
      if (!telefone || !cargo) {
        return ctx.badRequest("Telefone e Cargo são obrigatórios!");
      }
  
      // cria o usuario
      const user = await strapi.plugins["users-permissions"].services.user.add({
        username,
        email,
        password,
      });
  
      // perfil associado ao usuario
      await strapi.query("perfil").create({
        telefone,
        cargo,
        user: user.id,
      });
  
      return ctx.send({ user });
    },
  };