import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AdminRepository } from "../../repositories/admin/admin.repository";
import { AdminLoginDTO } from "../../dto/admin/admin.dto";

const adminRepository = new AdminRepository();

export class AdminAuthService {
    async login(data: AdminLoginDTO){
        const admin = await adminRepository.findByEmail(data.email);
        console.log("Found admin:", admin);
        if(!admin){
            throw new Error("Admin not found");
        }

        const isMatch = await bcrypt.compare(data.password, admin.password);
        if(!isMatch){
            throw new Error("Invalid credentials");
        }
        
        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: "Admin" },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        return { admin, token }
    }
}