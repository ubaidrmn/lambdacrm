import { Project } from "@/types/project.model";
import UserRepository from "@/repositories/user.repository";
import { User } from '@/types/user.model';

export default class UserService {

    async getUserProjects(user: User): Promise<Project[]> {
        const userRepository = new UserRepository();
        const projects = await userRepository.findProjectsByUser(user);
        return projects;
    }

}