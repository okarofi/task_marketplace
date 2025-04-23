const { Product, Purchase, sequelize } = require("../models")
class PusrchaseControllers {
    static async addPurchase(req, res) {
        const t = await sequelize.transaction();
        try {
            const { productId } = req.body;
            
            // validasi input sederhana
            if (!productId) {
                // return res.status(400).json({ message: 'productId wajib diisi' });
                throw { status: 400, message: 'productId wajib diisi' }
            }

            // cek produk valid
            const product = await Product.findByPk(Number(productId));
            // console.log(product, "==> WHAT");
            
            if (!product) {
                return res.status(404).json({ message: 'Produk tidak ditemukan' });
            }
            
            const newPurchase = await Purchase.create({
                userId: req.user.id,
                productId
            }, { transaction: t });

            // jangan lupa kalau berhasil di commit
            await t.commit();

            res.status(201).json({ message: 'Purchase berhasil', data: newPurchase });
        } catch (error) {
            // kalau gagal di rollback
            await t.rollback()
            res.status(500).json({ message: 'Gagal purchase', error: error.message });
        }
        

    }


}

module.exports = PusrchaseControllers