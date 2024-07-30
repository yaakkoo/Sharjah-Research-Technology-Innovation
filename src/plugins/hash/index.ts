import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import crypto from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(crypto.scrypt);

const hashPlugin = async (instance: FastifyInstance) => {
    instance.decorateRequest('hash', async (text: string) => {
        const salt = crypto.randomBytes(8).toString('hex');

        const derivedKey = (await scrypt(text, salt, 64)) as Buffer

        return `${salt}:${derivedKey.toString('hex')}`
    })

    instance.decorateRequest('verify', async (text: string, hash: string) => {

        const [salt, key] = hash.split(':')

        if (salt && key) {
            const keyBuffer = Buffer.from(key, 'hex');
            const derivedKey = (await scrypt(text, salt, 64)) as Buffer;      
            return crypto.timingSafeEqual(keyBuffer, derivedKey);
        }

        return false;

    })

}

export default fp(hashPlugin, {
    name: 'app-hash',
});
