
import hash from "object-hash";
/**
     * Generates a SHA-1 hash of obj, ignoring the hash field of obj
     * @param obj
     */
    export function generateHash(obj) {
        return hash.default(obj, {
            algorithm: "sha1",
            excludeKeys: function(key) {
                if (key === "hash") {
                    return true;
                }
                return false;
            },
        });
    }