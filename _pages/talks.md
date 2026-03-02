---
layout: page
permalink: /talks/
title: Talks
description: Invited talks, seminars, and conference poster presentations.
nav: true
nav_order: 2.5
---

{% assign cv = site.data.cv.cv %}
{% assign invited_talks = cv.sections['Invited Talks'] %}
{% assign poster_presentations = cv.sections['Poster Presentations'] %}

<div class="cv">
  {% if invited_talks and invited_talks.size > 0 %}
    <a class="anchor" id="invited-talks"></a>
    <div class="card mt-3 p-3">
      <h3 class="card-title font-weight-medium">Invited Talks & Seminars</h3>
      <div>
        {% assign entries = invited_talks %}
        {% include cv/experience.liquid %}
      </div>
    </div>
  {% endif %}

  {% if poster_presentations and poster_presentations.size > 0 %}
    <a class="anchor" id="conference-posters"></a>
    <div class="card mt-3 p-3">
      <h3 class="card-title font-weight-medium">Conference Posters</h3>
      <div>
        {% assign entries = poster_presentations %}
        {% include cv/experience.liquid %}
      </div>
    </div>
  {% endif %}

  {% if invited_talks == nil or invited_talks.size == 0 %}
    {% if poster_presentations == nil or poster_presentations.size == 0 %}
      <div class="card mt-3 p-3">
        <p class="mb-0">No talks or poster presentations available yet.</p>
      </div>
    {% endif %}
  {% endif %}
</div>
