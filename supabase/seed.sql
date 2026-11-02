-- ====================================================================
-- ATOMIC APEX STUDIO - SEED DATA
-- Seed user: pcgowshik@gmail.com / ApexStudio@2026!X
-- ====================================================================

DO $$
DECLARE
    new_user_id UUID := 'a0000000-0000-0000-0000-000000000001'::uuid;
BEGIN
    -- Check if user exists in auth.users
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'pcgowshik@gmail.com') THEN
        -- Insert into auth.users (Supabase encrypted password standard)
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            role,
            confirmation_token
        ) VALUES (
            new_user_id,
            '00000000-0000-0000-0000-000000000000'::uuid,
            'pcgowshik@gmail.com',
            crypt('ApexStudio@2026!X', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"full_name":"Gowshik Admin","avatar_url":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}'::jsonb,
            NOW(),
            NOW(),
            'authenticated',
            ''
        );

        -- Insert Profile with 100 credits
        INSERT INTO public.profiles (
            id,
            email,
            full_name,
            avatar_url,
            credits,
            role,
            created_at,
            updated_at
        ) VALUES (
            new_user_id,
            'pcgowshik@gmail.com',
            'Gowshik (Apex Founder)',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            100,
            'admin',
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
            credits = 100,
            role = 'admin';

        -- Insert Seed Generations (Images & Videos)
        INSERT INTO public.generations (
            id,
            user_id,
            type,
            model,
            prompt,
            negative_prompt,
            parameters,
            status,
            output_url,
            thumbnail_url,
            aspect_ratio,
            duration,
            credits_cost,
            is_favorite
        ) VALUES 
        (
            'b0000000-0000-0000-0000-000000000001'::uuid,
            new_user_id,
            'video',
            'Studio V1 (Cinema)',
            'Cinematic drone tracking shot of an obsidian cyberpunk monolith in neon rain, volumetric lighting, photorealistic 8k octane render',
            'blurry, low quality, distortion, jitter',
            '{"camera":"drone-orbit", "fps": 30, "motion": 8}'::jsonb,
            'completed',
            'https://cdn.higgsfield.ai/card/16eebc9a-8310-4f68-8a02-1e2e6f109169.mp4',
            'https://static-public-media.higgsfield.ai/cards/e00fa340-fd99-47d6-ae8f-9bdd20f9393e.webp',
            '16:9',
            '5s',
            5,
            true
        ),
        (
            'b0000000-0000-0000-0000-000000000002'::uuid,
            new_user_id,
            'video',
            'Swift V1',
            'High-fashion streetwear model walking in Tokyo night street, anamorphic lens flare, cinematic slow motion',
            'pixelated, watermark, artifacts',
            '{"camera":"tracking", "fps": 24, "motion": 7}'::jsonb,
            'completed',
            'https://static-public-media.higgsfield.ai/cards/d6b970cb-8a24-41e6-8c83-023fd2ab585b.mp4',
            'https://static.higgsfield.ai/kling-4.0/explore-banner-v2/streetwear.webp',
            '9:16',
            '5s',
            5,
            true
        ),
        (
            'b0000000-0000-0000-0000-000000000003'::uuid,
            new_user_id,
            'image',
            'Apex Vision V2',
            'Hyper-detailed portrait of a synthetic cybernetic muse, glowing emerald eyes, intricate bioluminescent filigree, Hasselblad 100mm f/1.4',
            'ugly, deformed, bad anatomy, text, cartoon',
            '{"guidance": 7.5, "steps": 35, "sampler": "DPM++ 2M Karras"}'::jsonb,
            'completed',
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=85',
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
            '16:9',
            NULL,
            2,
            true
        ),
        (
            'b0000000-0000-0000-0000-000000000004'::uuid,
            new_user_id,
            'image',
            'Apex Vision V2',
            'Futuristic luxury architectural pavilion perched above misty Nordic fjords at twilight, architectural digest, warm interior glow',
            'oversaturated, noise, artifacts',
            '{"guidance": 8.0, "steps": 40}'::jsonb,
            'completed',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=85',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80',
            '16:9',
            NULL,
            2,
            false
        );
    END IF;
END $$;
