require('dotenv').config();
const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    const adminHash = await bcrypt.hash('admin123', 10);
    const userHash = await bcrypt.hash('user123', 10);

    await db.query('DELETE FROM purchases');
    await db.query('DELETE FROM resources');
    await db.query('DELETE FROM users');
    await db.query('ALTER TABLE purchases AUTO_INCREMENT = 1');
    await db.query('ALTER TABLE resources AUTO_INCREMENT = 1');
    await db.query('ALTER TABLE users AUTO_INCREMENT = 1');

    await db.query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)',
      [
        'admin', adminHash, 'admin',
        'stelle', userHash, 'user',
        'caelus', userHash, 'user',
      ]
    );

    await db.query(`
      INSERT INTO resources (name, type, description, stock, image, price) VALUES
      ('Stellar Jade', 'Currency', 'Primary premium currency used to pull on Warps. Obtained from events, quests, and the Trailblaze Pass.', 999, null, 1.99),
      ('Oneiric Shard', 'Currency', 'Special currency used to purchase items in the Embers Exchange and Top-Up Center.', 500, null, 0.99),
      ('Trailblaze Power Fuel', 'Consumable', 'Restores 60 Trailblaze Power immediately. Essential for farming Calyxes and Caverns of Corrosion.', 200, null, 2.49),
      ('Memory Turbulence Fragment', 'Material', 'Rare ascension material dropped from Stagnant Shadows. Required for character level-up past 40.', 150, null, 3.99),
      ('Silvermane Badge', 'Material', 'Enemy drop from Silvermane Guards. Used for character trace upgrades.', 300, null, 0.49),
      ('Arrow of the Beast Hunter', 'Light Cone', 'A 3-star Light Cone for the Hunt path. Increases CRIT Rate against enemies with lower HP.', 50, null, 4.99),
      ('Cornucopia', 'Light Cone', 'A 3-star Light Cone for the Abundance path. Increases healing from abilities.', 50, null, 4.99),
      ('Void', 'Light Cone', 'A 3-star Light Cone for the Nihility path. Reduces enemy Effect RES at battle start.', 50, null, 4.99),
      ('Cruising in the Stellar Sea', 'Light Cone', 'A 5-star Light Cone for the Hunt path. Raises CRIT Rate and ATK after defeating enemies.', 10, null, 29.99),
      ('In the Name of the World', 'Light Cone', 'A 5-star Light Cone for the Nihility path. Boosts debuff hit rate and ATK for skill use.', 10, null, 29.99),
      ('Credit', 'Currency', 'Standard in-game currency. Used for almost every upgrade system in the game.', 9999, null, 0.19),
      ('Lost Crystal', 'Material', 'Crafting material for Relics. Obtained from Caverns of Corrosion runs.', 80, null, 5.99),
      ('Special Star Rail Pass', 'Pass', 'Limited Warp ticket usable only on limited-time Character Event Warps. Cannot be used on standard banner.', 100, null, 3.99),
      ('Star Rail Pass', 'Pass', 'Standard Warp ticket usable on the Stellar Warp and departure warp. Great for building standard roster.', 150, null, 3.49),
      ('Condensed Aether', 'Consumable', 'Converts into 40 Trailblaze Power upon use. Capped at 200 stored. Cannot exceed Trailblaze Power max.', 120, null, 1.99),
      ('Traveler Guide', 'Consumable', 'EXP material granting 50,000 character EXP. Most efficient way to level characters quickly.', 200, null, 2.99),
      ('Refined Aether', 'Consumable', 'Grants 10,000 character EXP. Smaller version of Traveler Guide for fine-tuned leveling.', 500, null, 0.79),
      ('Relic Remains', 'Material', 'Used to craft specific Relics at the Synthesizer. Saves farming time for targeted stat pieces.', 60, null, 6.99),
      ('Tears of Dreams', 'Material', 'Rare trace upgrade material from Stagnant Shadows. Required for high-tier character skill unlocks.', 90, null, 4.49),
      ('Broken Teeth of Iron Wolf', 'Material', 'Enemy drop from Automaton mobs. Used for Destruction path character ascension and traces.', 250, null, 0.59),
      ('Immortal Lumintwig', 'Material', 'High-tier ascension material from Propagation enemies. Needed for endgame character builds.', 70, null, 7.49),
      ('Night of Fright', 'Light Cone', 'A 5-star Light Cone for the Abundance path. Restores energy and boosts healing for the team.', 10, null, 29.99),
      ('Patience Is All You Need', 'Light Cone', 'A 5-star Light Cone for the Nihility path. Stacks SPD and DoT damage bonus on enemy hits.', 10, null, 29.99),
      ('Moment of Victory', 'Light Cone', 'A 5-star Light Cone for the Preservation path. Increases DEF and taunts enemies to attack wearer.', 10, null, 29.99),
      ('Warp Ticket Bundle x10', 'Bundle', 'Contains 10 Special Star Rail Passes. Guarantees at least one 4-star item. Best value per pull.', 30, null, 34.99),
      ('Firefly Character Bundle', 'Bundle', 'Includes Firefly 5-star character card, 20 Special Passes, and exclusive namecard. Limited stock.', 15, null, 59.99),
      ('Acheron Character Bundle', 'Bundle', 'Includes Acheron 5-star character card, 20 Special Passes, and exclusive avatar frame. Limited stock.', 15, null, 59.99),
      ('Robin Character Bundle', 'Bundle', 'Includes Robin 5-star character card, 20 Special Passes, and costume unlock. Limited stock.', 15, null, 59.99),
      ('Starter Pack', 'Bundle', 'Perfect for new Trailblazers. Includes 10 Star Rail Passes, 3000 Credits, and 2 Condensed Aether.', 999, null, 9.99),
      ('Monthly Pass', 'Subscription', 'Grants 300 Stellar Jade immediately and 90 Stellar Jade daily for 30 days. Best value long-term.', 999, null, 4.99),
      ('Trailblaze Pass Premium', 'Subscription', 'Unlocks premium rewards track for the current Trailblaze Pass season. Retroactively claims missed rewards.', 500, null, 9.99),
      ('Nameless Honor', 'Subscription', 'Monthly subscription granting bonus EXP, Credits, and exclusive avatar border for 30 days.', 500, null, 14.99),
      ('Thatch Umbrella', 'Light Cone', 'A 4-star Light Cone for the Abundance path. Increases healing output when HP is above 50%.', 40, null, 9.99),
      ('Subscribe for More', 'Light Cone', 'A 4-star Light Cone for the Nihility path. Increases DoT damage dealt by the wearer.', 40, null, 9.99),
      ('Make the World Clamor', 'Light Cone', 'A 4-star Light Cone for the Erudition path. Restores energy after using ultimate.', 40, null, 9.99),
      ('We Are Wildfire', 'Light Cone', 'A 4-star Light Cone for the Preservation path. Reduces damage taken by all allies at battle start.', 40, null, 9.99),
      ('Planetary Rendezvous', 'Light Cone', 'A 4-star Light Cone for the Harmony path. Boosts ally damage when sharing same element as wearer.', 40, null, 9.99),
      ('Eidolon Fragment E1', 'Eidolon', 'Unlocks first Eidolon for a selected 4-star character. Permanently enhances one of their abilities.', 25, null, 12.99),
      ('Eidolon Fragment E2', 'Eidolon', 'Unlocks second Eidolon for a selected 4-star character. Adds passive or skill enhancement.', 20, null, 12.99),
      ('Eidolon Fragment E6', 'Eidolon', 'Fully constellates a selected 4-star character. Maximum power unlock. Extremely rare.', 5, null, 49.99),
      ('Superimposition S1', 'Superimposition', 'Upgrades a selected Light Cone to Superimposition 1. Increases the cone passive effect by 25%.', 20, null, 14.99),
      ('Superimposition S5', 'Superimposition', 'Fully superimposes a selected Light Cone to maximum rank. Doubles passive effect strength.', 5, null, 59.99),
      ('Ancient Part', 'Material', 'Common crafting material from Automaton enemies. Used for early-game trace and ascension upgrades.', 999, null, 0.29),
      ('Ancient Spindle', 'Material', 'Mid-tier Automaton drop. Required for trace upgrades of Erudition and Harmony path characters.', 400, null, 0.89),
      ('Ancient Engine', 'Material', 'Rare Automaton drop. Used in high-tier character ascension and advanced trace unlocks.', 180, null, 1.99),
      ('Horn of Snow', 'Material', 'Ascension material from Cocolia boss. Required for Ice element character level caps.', 60, null, 8.99),
      ('Dream Fliege', 'Material', 'Dropped by Dreamjolt Troupe enemies. Used for Remembrance path character traces.', 120, null, 3.49),
      ('Tatters of Thought', 'Material', 'Common Dreamjolt drop. Lowest tier trace material for Remembrance path upgrades.', 600, null, 0.39),
      ('Fragments of Impression', 'Material', 'Mid-tier Dreamjolt drop. Required for level 4-6 trace upgrades on Remembrance characters.', 300, null, 0.89),
      ('Relic Set: Space Sealing Station', 'Relic', 'Full 4-piece Relic set boosting ATK. Best-in-slot for many DPS characters. Pre-rolled with good substats.', 8, null, 19.99),
      ('Relic Set: Musketeer of Wild Wheat', 'Relic', 'Full 4-piece Relic set boosting ATK and SPD. Versatile set for Hunt path DPS builds.', 8, null, 19.99),
      ('Relic Set: Longevous Disciple', 'Relic', 'Full 4-piece Relic set for HP-scaling characters. Increases Max HP and CRIT Rate.', 8, null, 19.99),
      ('Relic Set: Pioneer Diver of Dead Waters', 'Relic', 'Full 4-piece Relic set for debuff-focused Nihility characters. Boosts CRIT against debuffed enemies.', 8, null, 19.99),
      ('Omniscia Spacesuit', 'Cosmetic', 'Exclusive costume for Stelle. Changes her outfit to a sleek Interastral Peace Corps uniform. Purely visual.', 50, null, 15.99)
    `);

    console.log('Seed complete.');
    console.log('  admin / admin123  (role: admin)');
    console.log('  stelle / user123  (role: user)');
    console.log('  caelus / user123  (role: user)');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
