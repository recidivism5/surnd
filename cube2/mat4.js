class Mat4 extends Float32Array
    {
        constructor()
        {
            super(16);
            this.setIdentity();
        }
        setIdentity()
        {
            this.fill(0);
            this[0]  = 1;
            this[5]  = 1;
            this[10] = 1;
            this[15] = 1;
        }
        perspective(fov_radians, aspect_ratio, near, far)
        {
            let S = 1.0/Math.tan(fov_radians/2);
            let d = near - far;
            
            this[0] = S/aspect_ratio;
            this[5] = S;
            this[10] = (far+near)/d;
            this[11] = -1.0;
            this[14] = (2*far*near)/d;
            this[15] = 0.0;
        }
        translate(v)
        {
            this[12] += v[0];
            this[13] += v[1];
            this[14] += v[2];
        }
        setPos(v)
        {
            this[12] = v[0];
            this[13] = v[1];
            this[14] = v[2];
        }
        setRotationX(theta)
        {
            let c = Math.cos(theta);
            let s = Math.sin(theta);
            this[0] = 1;
            this[1] = 0;
            this[2] = 0;
            this[4] = 0;
            this[5] = c;
            this[6] = s;
            this[8] = 0;
            this[9] = -s;
            this[10] = c;
        }
        setRotationY(theta)
        {
            let c = Math.cos(theta);
            let s = Math.sin(theta);
            this[0]  = c;
            this[1]  = 0;
            this[2]  = -s;
            this[4]  = 0;
            this[5]  = 1;
            this[6]  = 0;
            this[8]  = s;
            this[9]  = 0;
            this[10] = c;
        }
        setRotationZ(theta)
        {
            let c = Math.cos(theta);
            let s = Math.sin(theta);
            this[0]  = c;
            this[1]  = s;
            this[2]  = 0;
            this[4]  = -s;
            this[5]  = c;
            this[6]  = 0;
            this[8]  = 0;
            this[9]  = 0;
            this[10] = 1;
        }
        mult(b)
        {
            let output = new Mat4();
            let f, m;
            for (let i = 0; i < 16; i++)
            {
                f = 4 * Math.floor(i/4);
                m = i%4;
                output[i] = this[f] * b[m] + this[f+1] * b[m+4] + this[f+2] * b[m+8] + this[f+3] * b[m+12];
            }
            for (let i = 0; i < 16; i++)
            {
                this[i] = output[i];
            }
        }
        lookAt(cam_pos, center, up)
        {
            function cross_product(vec1, vec2, output)
            {
                output[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
                output[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
                output[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
            }

            let F = [];
            F[0] = center[0] - cam_pos[0];
            F[1] = center[1] - cam_pos[1];
            F[2] = center[2] - cam_pos[2];

            let F_magnitude = Math.sqrt(F[0]*F[0] + F[1]*F[1] + F[2]*F[2]);
            F[0] = F[0] / F_magnitude;
            F[1] = F[1] / F_magnitude;
            F[2] = F[2] / F_magnitude;

            let s = [];
            let s_normalized = [];
            let u = [];

            cross_product(F, up, s);
            let s_magnitude = Math.sqrt(s[0]*s[0] + s[1]*s[1] + s[2]*s[2]);
            s_normalized[0] = s[0] / s_magnitude;
            s_normalized[1] = s[1] / s_magnitude;
            s_normalized[2] = s[2] / s_magnitude;

            cross_product(s_normalized, F, u);
            let u_magnitude = Math.sqrt(u[0]*u[0] + u[1]*u[1] + u[2]*u[2]);

            F[0] = -F[0];
            F[1] = -F[1];
            F[2] = -F[2];

            this.setIdentity();
            this[0] = s_normalized[0];
            this[4] = s_normalized[1];
            this[8] = s_normalized[2];
            this[1]  =  u[0];
            this[5]  =  u[1];
            this[9]  =  u[2];
            this[2]  =  F[0];
            this[6]  =  F[1];
            this[10] =  F[2];

            this[12] = -cam_pos[0];
            this[13] = -cam_pos[1];
            this[14] = -cam_pos[2];
        }
    }