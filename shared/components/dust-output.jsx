/** @jsx React.DOM */
/* global React, dust */

export default React.createClass({
    displayName: 'DustOutput',

    getInitialState: function () {
        var tmpl;
        tmpl = dust.compile(this.props.source, this.props.exampleId);
        dust.loadSource(tmpl);
        // The state that we have is the compiled template, but alas this is
        // passed through in a side channel (registered inside of dust).
        return {};
    },

    componentWillReceiveProps: function (nextProps) {
        var tmpl;
        if (nextProps.source !== this.props.source) {
            tmpl = dust.compile(nextProps.source, this.props.exampleId);
            dust.loadSource(tmpl);
            // The state that we have is the compiled template, but alas this is
            // passed through in a side channel (registered inside of dust).
            this.setState({});
        }
    },

    render: function () {
        var context = {},
            html,
            nextTick;

        Object.assign(context, this.props.context, {
            intl: {
                locales : this.props.locales,
                formats : this.props.formats,
                messages: this.props.messages
            }
        });

        // This de-async is hacky, and only works because our example templates
        // are simple (don't reference external resources such as partials).
        nextTick = dust.nextTick;
        dust.nextTick = function(cb) { cb(); };
        dust.render(this.props.exampleId, context, function(err, out) {
            dust.nextTick = nextTick;
            if (!err && out) {
                html = out;
            }
        });
        if (html) {
            return (
                <div className="dust-output"
                    // Cool cuz dust will have already escaped the context.
                    dangerouslySetInnerHTML={{__html: html}}/>
            );
        }
    }
});
