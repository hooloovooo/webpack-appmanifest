var fs = require('fs');
var path = require('path');
var _ = require('lodash');

function WebAppManifestPlugin(opts) {
    this.opts = _.assign({
        basePath: '',
        fileName: 'manifest.json'
    }, opts || {});
};

WebAppManifestPlugin.prototype.getFileType = function(str) {
    return str.split('.').pop();
};

WebAppManifestPlugin.prototype.apply = function(compiler) {
    var outputName = this.opts.fileName;
    var outputPath = path.join(compiler.options.output.path, outputName);

    var self = this;

    compiler.plugin('emit', function(compilation, compileCallback){
        var manifest = {
            'lang': self.opts.lang || 'en',
            'name': self.opts.name || 'Unnamed',
            'short_name': self.opts.short_name || 'None',
            'icons': self.opts.icons || [],
            'start_url': self.opts.start_url || '',
            'display': self.opts.display || 'standalone',
            "gcm_sender_id": self.opts.gcm_sender_id || "",
            "gcm_user_visible_only": false
        };

        manifest = JSON.stringify(manifest, null, 2);

        compilation.assets[outputName] = {
            source: function() {
                return manifest;
            },
            size: function() {
                return manifest.length;
            }
        };

        compileCallback();
    });
};

module.exports = WebAppManifestPlugin;
