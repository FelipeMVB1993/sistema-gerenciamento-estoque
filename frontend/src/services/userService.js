const API_BASE_URL = "http://localhost:3001";

class UserService {
  async store(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/tokens/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error(" Aluno já está cadastrado no sistema!");
      }
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
