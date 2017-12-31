---
layout: page
title: "deuxfoiscinq.ch — À la découverte des bons vins en flacon de 5 dl de la Suisse romande"
image:
  feature: /images/divers-images/vignoble-002.jpg
  credit: jissé
  creditlink: http://deuxfoiscinq.ch/
---

{: .entry-title }
# deuxfoiscinq.ch

{: .entry-title }
## {{ site.description }}

<ul class="post-list">
{% for post in site.posts %}
  <li><article>

  <a href="{{ site.url }}{{ post.url }}">

<div class="etiquette">
<img alt="etiquette" src="{{ site.url }}{{ post.etiquette }}" />
</div>
  {{ post.title }} <span class="entry-date"><time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: ' %-d' }}&#160;{% assign m = post.date | date: "%-m" %}
          {% case m %}
            {% when '1' %}janvier
            {% when '2' %}février
            {% when '3' %}mars
            {% when '4' %}avril
            {% when '5' %}mai
            {% when '6' %}juin
            {% when '7' %}juillet
            {% when '8' %}août
            {% when '9' %}septembre
            {% when '10' %}octobre
            {% when '11' %}novembre
            {% when '12' %}décembre
          {% endcase %}&#160;{{ post.date | date: '%Y' }}</time>{% if post.notif-modifs == true %}
          <br /><span class="notif-modifs">MIS À JOUR LE&nbsp;<time datetime="{{ post.modified | date_to_xmlschema }}">{{ post.modified | date: ' %-d' }}&#160;{% assign m = post.modified | date: "%-m" %}
          {% case m %}
            {% when '1' %}janvier
            {% when '2' %}février
            {% when '3' %}mars
            {% when '4' %}avril
            {% when '5' %}mai
            {% when '6' %}juin
            {% when '7' %}juillet
            {% when '8' %}août
            {% when '9' %}septembre
            {% when '10' %}octobre
            {% when '11' %}novembre
            {% when '12' %}décembre
          {% endcase %}&#160;{{ post.modified | date: '%Y' }}</time></span>{% endif %}</span>
          {% if post.vigneron %} <span class="vigneron">{{ post.vigneron | remove: '\[ ... \]' | remove: '\( ... \)' | markdownify | strip_html | strip_newlines | escape_once }}</span>{% endif %}
          {% if post.teaser %} <span class="teaser">{{ post.teaser | remove: '\[ ... \]' | remove: '\( ... \)' | markdownify | strip_html | strip_newlines | escape_once }}</span>{% endif %}
          </a>
          </article></li>
{% endfor %}
</ul>
